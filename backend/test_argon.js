const argon2 = require('argon2');

async function testArgon() {
  try {
    const hash = await argon2.hash('AdminPassword2026!', {
      type: argon2.argon2id, // Argon2id: el estándar más seguro contra ataques de canal lateral y GPU
      memoryCost: 2 ** 16,  // 64 MB
      timeCost: 3,          // 3 iteraciones
      parallelism: 1,
    });
    console.log('Argon2 Hash Generado:', hash);
    const isValid = await argon2.verify(hash, 'AdminPassword2026!');
    console.log('Argon2 Verify OK:', isValid);
  } catch (err) {
    console.error('Error con Argon2:', err);
  }
}

testArgon();
