from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:varj@localhost/personas'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

db = SQLAlchemy(app) # interacuuar bd
ma = Marshmallow(app)

class Persona(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(20))
    fena = db.Column(db.String(10))
    puesto = db.Column(db.String(20))

    def __init__(self,nombre,fena,puesto):
        self.nombre = nombre
        self.fena = fena
        self.puesto = puesto

db.create_all()

class PersonaSchema(ma.Schema):
    class Meta:
        fields =('id','nombre','fena','puesto')

persona_schema = PersonaSchema()
personas_schema = PersonaSchema(many=True)

#@app.route('/tasks', methods=['Post'])
@app.route('/personas', methods=['POST'])
def create_persona():
    nombre = request.json['nombre']
    fena = request.json['fena']
    puesto = request.json['puesto']

    new_persona = Persona(nombre,fena,puesto)
    db.session.add(new_persona)
    db.session.commit()
    return persona_schema.jsonify(new_persona)

@app.route('/personas', methods=['GET'])
def get_personas():
    todos = Persona.query.all()
    resultado = personas_schema.dump(todos)
    return jsonify(resultado)

@app.route('/personas/<id>', methods=['GET'])
def get_persona(id):
  persona = Persona.query.get(id)
  return persona_schema.jsonify(persona)


@app.route('/personas/<id>', methods=['PUT'])
def update_persona(id):
    persona = Persona.query.get(id)

    nombre = request.json['nombre']
    fena = request.json['fena']
    puesto = request.json['puesto']

    persona.nombre = nombre
    persona.fena = fena
    persona.puesto = puesto

    db.session.commit()
    return persona_schema.jsonify(persona)

@app.route('/personas/<id>', methods=['DELETE'])
def delete_persona(id):
    persona = Persona.query.get(id)
    db.session.delete(persona)
    db.session.commit()
    return persona_schema.jsonify(persona)

if __name__ == "__main__":
    app.run(debug=True)