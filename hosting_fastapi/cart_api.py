from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import pymongo
from pymongo import MongoClient

# MongoDB connection (reuse same settings as main)
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017/pc_nfactory_db")
client = MongoClient(MONGODB_URI)
db = client.get_database("pc_nfactory_db")

# Collection for cart items per session
cart_collection = db["carritos"]  # Documents: {session_id: str, items: [{product_name, price, quantity, total}]}

class CartManager:
    """Cart manager backed by MongoDB."""

    @staticmethod
    def _ensure_session(session_id: str):
        if not cart_collection.find_one({"session_id": session_id}):
            cart_collection.insert_one({"session_id": session_id, "items": []})

    @staticmethod
    def get_cart(session_id: str) -> List[Dict[str, Any]]:
        doc = cart_collection.find_one({"session_id": session_id})
        return doc["items"] if doc else []

    @staticmethod
    def _find_product_price(product_name: str) -> float:
        # Search product catalog for matching name (case‑insensitive)
        prod = db["productos"].find_one({"nombre": {"$regex": f"^{product_name}$", "$options": "i"}})
        if not prod:
            raise HTTPException(status_code=404, detail=f"Producto '{product_name}' no encontrado en el catálogo")
        return float(prod.get("precio", 0))

    @staticmethod
    def add_to_cart(session_id: str, product_name: str, quantity: int = 1) -> Dict[str, Any]:
        CartManager._ensure_session(session_id)
        price = CartManager._find_product_price(product_name)
        doc = cart_collection.find_one({"session_id": session_id})
        items = doc["items"]
        # Update existing item if present
        for item in items:
            if item["product_name"].lower() == product_name.lower():
                item["quantity"] += quantity
                item["total"] = round(item["price"] * item["quantity"], 2)
                cart_collection.update_one({"session_id": session_id}, {"$set": {"items": items}})
                return {"success": True, "message": f"Actualizada cantidad de {product_name}", "cart": items}
        # Add new item
        new_item = {
            "product_name": product_name,
            "price": price,
            "quantity": quantity,
            "total": round(price * quantity, 2),
        }
        items.append(new_item)
        cart_collection.update_one({"session_id": session_id}, {"$set": {"items": items}})
        return {"success": True, "message": f"Añadido {product_name} al carrito", "cart": items}

    @staticmethod
    def view_cart(session_id: str) -> Dict[str, Any]:
        items = CartManager.get_cart(session_id)
        if not items:
            return {"success": True, "message": "Tu carrito está vacío", "cart": [], "cart_total": 0}
        total = sum(item["total"] for item in items)
        return {"success": True, "message": f"Tu carrito tiene {len(items)} ítems", "cart": items, "cart_total": round(total, 2)}

    @staticmethod
    def clear_cart(session_id: str) -> Dict[str, Any]:
        cart_collection.delete_one({"session_id": session_id})
        return {"success": True, "message": "El carrito ha sido borrado"}

    @staticmethod
    def remove_from_cart(session_id: str, product_name: str) -> Dict[str, Any]:
        doc = cart_collection.find_one({"session_id": session_id})
        if not doc or not doc["items"]:
            return {"success": False, "message": "Tu carrito ya está vacío"}
        items = doc["items"]
        for i, item in enumerate(items):
            if product_name.lower() in item["product_name"].lower() or item["product_name"].lower() in product_name.lower():
                removed = items.pop(i)
                cart_collection.update_one({"session_id": session_id}, {"$set": {"items": items}})
                return {"success": True, "message": f"Eliminado {removed['product_name']} del carrito", "cart": items}
        return {"success": False, "message": f"Producto '{product_name}' no encontrado en tu carrito"}

    @staticmethod
    def update_quantity(session_id: str, product_name: str, quantity: int) -> Dict[str, Any]:
        if quantity <= 0:
            return CartManager.remove_from_cart(session_id, product_name)
        doc = cart_collection.find_one({"session_id": session_id})
        if not doc or not doc["items"]:
            return {"success": False, "message": "Tu carrito está vacío"}
        items = doc["items"]
        for item in items:
            if product_name.lower() in item["product_name"].lower() or item["product_name"].lower() in product_name.lower():
                item["quantity"] = quantity
                item["total"] = round(item["price"] * quantity, 2)
                cart_collection.update_one({"session_id": session_id}, {"$set": {"items": items}})
                return {"success": True, "message": f"Cantidad actualizada de {item['product_name']} a {quantity}", "cart": items}
        return {"success": False, "message": f"Producto '{product_name}' no encontrado en tu carrito"}

# --- Pydantic schemas ---
class CartSession(BaseModel):
    session_id: str

class AddToCartRequest(CartSession):
    product_name: str
    quantity: Optional[int] = 1

class RemoveFromCartRequest(CartSession):
    product_name: str

class UpdateCartRequest(CartSession):
    product_name: str
    quantity: int

router = APIRouter(prefix="/api/cart", tags=["Carrito (MongoDB)"])

@router.post("/add")
def add_to_cart(req: AddToCartRequest):
    result = CartManager.add_to_cart(req.session_id, req.product_name, req.quantity or 1)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

@router.get("/view")
def view_cart(session_id: str):
    return CartManager.view_cart(session_id)

@router.post("/clear")
def clear_cart(req: CartSession):
    return CartManager.clear_cart(req.session_id)

@router.post("/remove")
def remove_from_cart(req: RemoveFromCartRequest):
    result = CartManager.remove_from_cart(req.session_id, req.product_name)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

@router.post("/update")
def update_cart(req: UpdateCartRequest):
    result = CartManager.update_quantity(req.session_id, req.product_name, req.quantity)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result
