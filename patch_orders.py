import random
import time

code = open("/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py", "r").read()

order_models = """class OrderItem(BaseModel):
    productId: Optional[str] = ""
    name: Optional[str] = ""
    price: Optional[float] = 0
    quantity: Optional[int] = 1

class CreateOrderRequest(BaseModel):
    items: List[Dict[str, Any]]
    total: Optional[float] = 0
    paymentMethod: Optional[str] = "Webpay Plus"
    customer: Optional[Dict[str, Any]] = None
    shippingAddress: Optional[Dict[str, Any]] = None
"""

create_order_endpoint = """@app.post("/api/orders", tags=["Pedidos"])
def create_order_endpoint(data: CreateOrderRequest, request: Request):
    user_id = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = ObjectId(payload["id"])
        except Exception:
            pass

    order_num = f"PED-{int(time.time())}"
    track_num = f"CHX-{random.randint(100000, 999999)}"

    # Procesar items
    items_db = []
    subtotal = 0
    for it in data.items:
        p_name = it.get("name") or it.get("nombre") or "Componente Gamer"
        p_price = float(it.get("price") or it.get("precio") or 0)
        p_qty = int(it.get("quantity") or it.get("cantidad") or 1)
        st = p_price * p_qty
        subtotal += st
        items_db.append({
            "nombre": p_name,
            "precio": p_price,
            "cantidad": p_qty,
            "subtotal": st
        })

    final_total = data.total if data.total and data.total > 0 else subtotal

    order_doc = {
        "numeroPedido": order_num,
        "usuario": user_id,
        "cliente": data.customer or {"nombre": "Cliente PcÑactory", "correo": "cliente@pcnfactory.cl"},
        "direccionDespacho": data.shippingAddress or {"calle": "Av. Paicaví 3280", "ciudad": "Concepción", "region": "Biobío"},
        "items": items_db,
        "metodoPago": data.paymentMethod,
        "estadoPago": "Pagado",
        "estadoPedido": "En Preparación",
        "total": final_total,
        "numeroSeguimiento": track_num,
        "empresaTransporte": "Chilexpress",
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    res = db["pedidos"].insert_one(order_doc)
    return {
        "success": True,
        "id": str(res.inserted_id),
        "orderNumber": order_num,
        "trackingNumber": track_num
    }
"""

if "class CreateOrderRequest" not in code:
    code = code.replace("class UpsertFaqRequest(BaseModel):", order_models + "\nclass UpsertFaqRequest(BaseModel):")
    code = code.replace('@app.get("/api/orders", tags=["Pedidos"])', create_order_endpoint + "\n@app.get(\"/api/orders\", tags=[\"Pedidos\"])")
    open("/home/sacunad/UNIVERSIDAD/Programacion o mas proyectos/PcÑactory_Proyecto_Completo_Linux/hosting_fastapi/main.py", "w").write(code)
    print("FastAPI main.py parcheado con creación de órdenes!")
else:
    print("Ya estaba parcheado.")
