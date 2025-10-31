from flask import Blueprint, request, jsonify
from db import get_db_connection

tramites_bp = Blueprint('tramites', __name__)

# Crear trámite (solo admin)
@tramites_bp.route('/tramite', methods=['POST'])
def agregar_tramite():
    data = request.json
    nombre = data.get('nombre')
    correo = data.get('correo')
    tipo = data.get('tipo_tramite')
    descripcion = data.get('descripcion', '')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM ciudadanos WHERE nombre=%s AND correo=%s", (nombre, correo))
    ciudadano = cursor.fetchone()
    if ciudadano:
        id_ciudadano = ciudadano[0]
    else:
        cursor.execute("INSERT INTO ciudadanos (nombre, correo) VALUES (%s,%s)", (nombre, correo))
        id_ciudadano = cursor.lastrowid

    cursor.execute("""
        INSERT INTO tramites (id_ciudadano, tipo_tramite, descripcion, estado)
        VALUES (%s,%s,%s,'pendiente')
    """, (id_ciudadano, tipo, descripcion))
    id_tramite = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"mensaje":"Trámite agregado","id_tramite": id_tramite})

# Listar todos (solo admin)
@tramites_bp.route('/tramites', methods=['GET'])
def listar_tramites():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.id, c.nombre as ciudadano, c.correo, t.tipo_tramite, t.estado
        FROM tramites t
        JOIN ciudadanos c ON t.id_ciudadano = c.id
    """)
    tramites = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tramites)

# Actualizar trámite (solo admin)
@tramites_bp.route('/tramite/<int:id>', methods=['PUT'])
def actualizar_tramite(id):
    data = request.json
    estado = data.get('estado')
    tipo_tramite = data.get('tipo_tramite')
    descripcion = data.get('descripcion')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE tramites
        SET estado=%s, tipo_tramite=%s, descripcion=%s
        WHERE id=%s
    """, (estado, tipo_tramite, descripcion, id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje":"Trámite actualizado"})

# Eliminar trámite (solo admin)
@tramites_bp.route('/tramite/<int:id>', methods=['DELETE'])
def eliminar_tramite(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tramites WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje":"Trámite eliminado"})

# Consultar trámite por nombre y correo (cliente)
@tramites_bp.route('/generar-tramite', methods=['POST'])
def generar_tramite():
    data = request.json
    nombre = data.get('nombre','').strip()
    correo = data.get('correo','').strip()

    if not nombre or not correo:
        return {"error":"Nombre y correo son obligatorios"}, 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.id, t.tipo_tramite, t.estado, t.fecha_solicitud
        FROM tramites t
        JOIN ciudadanos c ON t.id_ciudadano = c.id
        WHERE c.nombre=%s AND c.correo=%s
    """,(nombre, correo))
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({"tramites": resultados})
