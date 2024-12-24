from flask import Blueprint, jsonify, request
from db import get_psql_conn

ordered = Blueprint("ordered", __name__)

@ordered.route('/ordered_', methods=['GET'])
def get_order():
    # print("LLLLLL")
    ordered_id = request.args.get('ordered_id')

    if not ordered_id:
        return jsonify({"error": "Missing ordered_id"}), 400

    try:
        conn = get_psql_conn()
        cursor = conn.cursor()

        query = """
            SELECT o.order_id, o.address, o.sub_total, o.shipping_fee
            FROM public."order" as o
            WHERE o.order_id = %s
        """
        cursor.execute(query, (ordered_id,))
        result = cursor.fetchone()

        # print(f"Query result: {result}")  # Print the result

        if not result:
            return jsonify({"error": "Order not found"}), 404

        order_data = {
            "order_id": result[0],
            "sub_total": float(result[2]),
            "shipping_fee": float(result[3]),
            "address": result[1] if result[1] else "No address provided",  # Handle empty address,
        }

        # print(f"Order data: {order_data}")  # Print the order data

        return jsonify(order_data), 200

    except Exception as e:
        print(f"Error: {e}")  # Log the exception to the server logs
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
