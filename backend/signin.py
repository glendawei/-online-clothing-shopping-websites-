from flask import Blueprint, jsonify, request, session, render_template, url_for
from db import get_psql_conn

signin = Blueprint("signin", __name__)

# return cloth name, price, image url, cloth_id, color
@signin.route('/signin_', methods=['POST'])
def signin_signin():
    psql_conn = get_psql_conn()
    if psql_conn is not None:
        cur = psql_conn.cursor()
    else:
        print("Failed to connect to the database.")

    data = request.json
    fname = data.get('fname')
    lname = data.get('lname')
    password = data.get('password')
    phone = data.get('phone')
    email = data.get('email')
    bdate = data.get('bdate')
    gender = data.get('gender').upper()[0]
    # print(bdate)

    try:
        cur.execute(
            '''
            INSERT INTO public."user" (fname, lname, password, phone, email, bdate, gender, role)
            VALUES(%s, %s, %s, %s, %s, %s, %s, 'U')
            ''',
            (fname, lname, password, phone, email, bdate, gender)
        )

        psql_conn.commit()
        return jsonify({"message": "successfully registered!"}), 200
    except Exception as e:
        psql_conn.rollback()
        print("An error occurred. Transaction rolled back.")
        print("Error details:", e)
        return jsonify({"error": str(e)}), 500