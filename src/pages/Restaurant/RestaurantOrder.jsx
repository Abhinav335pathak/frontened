import { useEffect, useState } from "react";
import { orderApi } from "../../services/api";
import { toast } from "react-hot-toast";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders for the restaurant
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getAll(); // ensure token is sent in headers
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderApi.update(id, { status });
      toast.success(`Order marked as "${status}"`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const outForDeliveryOrders = orders.filter((o) => o.status === "Out for Delivery");
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled");

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Restaurant Orders</h1>

      {loading && <p>Loading orders...</p>}

      {/* Pending Orders */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-yellow-600">🕒 Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <p className="text-gray-500">No pending orders.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {pendingOrders.map((order) => (
              <div key={order._id} className="border p-4 rounded-xl shadow-sm bg-white">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>User:</strong> {order.userId?.name || "N/A"}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</p>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleStatusUpdate(order._id, "Out for Delivery")}
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg"
                  >
                    Out for Delivery
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order._id, "Delivered")}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order._id, "Cancelled")}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Out for Delivery Orders */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-orange-600">🚚 Out for Delivery</h2>
        {outForDeliveryOrders.length === 0 ? (
          <p className="text-gray-500">No orders out for delivery.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {outForDeliveryOrders.map((order) => (
              <div key={order._id} className="border p-4 rounded-xl shadow-sm bg-white">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>User:</strong> {order.userId?.name || "N/A"}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</p>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleStatusUpdate(order._id, "Delivered")}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order._id, "Cancelled")}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delivered Orders */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-green-600">✅ Delivered Orders</h2>
        {deliveredOrders.length === 0 ? (
          <p className="text-gray-500">No delivered orders yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {deliveredOrders.map((order) => (
              <div key={order._id} className="border p-4 rounded-xl shadow-sm bg-gray-100">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</p>
                <p className="text-sm text-green-600 font-medium mt-2">Delivered ✔</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cancelled Orders */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-red-600">❌ Cancelled Orders</h2>
        {cancelledOrders.length === 0 ? (
          <p className="text-gray-500">No cancelled orders.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {cancelledOrders.map((order) => (
              <div key={order._id} className="border p-4 rounded-xl shadow-sm bg-gray-100">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</p>
                <p className="text-sm text-red-600 font-medium mt-2">Cancelled ❌</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RestaurantOrders;
