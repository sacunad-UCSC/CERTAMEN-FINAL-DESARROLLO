"""TOTP compatible con Google Authenticator y cifrado interoperable con Node."""
import base64
import hashlib
import os
import secrets
import jwt
import pyotp
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

JWT_SECRET = os.getenv('JWT_SECRET', 'clave_secreta_jwt_ucsc_2026')

def key():
    return hashlib.sha256((os.getenv('MFA_ENCRYPTION_KEY') or JWT_SECRET).encode()).digest()

def encrypt(secret):
    iv = secrets.token_bytes(12)
    return base64.b64encode(iv + AESGCM(key()).encrypt(iv, secret.encode(), None)).decode()

def decrypt(encrypted):
    raw = base64.b64decode(encrypted)
    return AESGCM(key()).decrypt(raw[:12], raw[12:], None).decode()

def setup_token(user_id):
    from datetime import datetime, timedelta, timezone
    return jwt.encode({'id':str(user_id),'purpose':'mfa_setup','exp':datetime.now(timezone.utc)+timedelta(minutes=5)}, JWT_SECRET, algorithm='HS256')

def setup_user(token):
    claims = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    if claims.get('purpose') != 'mfa_setup':
        raise ValueError('Token no es para activación MFA')
    return claims['id']

def verify_delta(secret, code):
    if not isinstance(code, str) or not (len(code)==6 and code.isascii() and code.isdigit()):
        return None
    import time
    totp = pyotp.TOTP(secret)
    current = int(time.time()) // 30
    for delta in (-1, 0, 1):
        if secrets.compare_digest(totp.at((current+delta)*30), code):
            return delta
    return None
