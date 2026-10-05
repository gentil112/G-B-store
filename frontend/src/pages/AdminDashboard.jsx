import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

const emptyProduct = { name: "", description: "", price: "", image: "", category: "", stock: "" };
const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const money = (value) => `${Number(value || 0).toLocaleString()} Rwf`;

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const request = useCallback(async (url, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed.");
    return data;
  }, [token]);

  const loadDashboard = useCallback(async () => {
    setError("");
    try {
      const [dashboard, productData, orderData, customerData] = await Promise.all([
        request("/admin/dashboard"),
        request("/products"),
        request("/admin/orders"),
        request("/admin/customers"),
      ]);
      setStats(dashboard.stats);
      setProducts(productData.products);
      setOrders(orderData.orders);
      setCustomers(customerData.customers);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [request]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const saveProduct = async (event) => {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      await request(editing ? `/products/${editing}` : "/products", {
        method: editing ? "PUT" : "POST", body: JSON.stringify(payload),
      });
      setNotice(editing ? "Product updated." : "Product added.");
      setEditing(null); setForm(emptyProduct);
      await loadDashboard();
    } catch (saveError) { setError(saveError.message); }
    finally { setBusy(false); }
  };

  const editProduct = (product) => {
    setEditing(product._id);
    setForm({ name: product.name, description: product.description, price: product.price, image: product.image, category: product.category, stock: product.stock });
    setTab("Products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    setError(""); setNotice("");
    try {
      await request(`/products/${product._id}`, { method: "DELETE" });
      setNotice("Product deleted."); await loadDashboard();
    } catch (deleteError) { setError(deleteError.message); }
  };

  const changeStatus = async (orderId, status) => {
    try {
      await request(`/admin/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setNotice("Order status updated."); await loadDashboard();
    } catch (statusError) { setError(statusError.message); throw statusError; }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">G&B STORE</p><h1 className="mt-1 text-2xl font-black">Admin dashboard</h1></div>
          <div className="flex items-center gap-4"><span className="hidden text-sm text-gray-500 sm:inline">{user?.name}</span><Link to="/" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold hover:border-primary">View store</Link></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <nav className="mb-7 flex gap-2 overflow-x-auto" aria-label="Dashboard sections">
          {["Overview", "Products", "Orders", "Customers"].map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-5 py-2.5 text-sm font-bold ${tab === item ? "bg-gray-950 text-white" : "bg-white text-gray-600 hover:text-primary"}`}>{item}</button>)}
        </nav>
        {error && <div role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        {notice && <div role="status" className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{notice}</div>}

        {tab === "Overview" && <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[["Total Products", stats?.products, "In your catalog"], ["Total Orders", stats?.orders, "All time"], ["Total Customers", stats?.customers, "Registered accounts"], ["Total Revenue", money(stats?.revenue), "Excluding cancelled"]].map(([label, value, hint]) => <section key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">{label}</p><p className="mt-3 text-3xl font-black">{value ?? "—"}</p><p className="mt-1 text-xs text-gray-400">{hint}</p></section>)}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[["Pending", stats?.orderStatuses?.pending], ["Processing", stats?.orderStatuses?.processing], ["Shipped", stats?.orderStatuses?.shipped], ["Delivered", stats?.orderStatuses?.delivered], ["Low / out of stock", `${stats?.lowStock ?? "—"} / ${stats?.outOfStock ?? "—"}`]].map(([label, value]) => <section key={label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-gray-500">{label}</p><p className="mt-2 text-2xl font-black">{value ?? "—"}</p></section>)}</div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2"><SalesChart points={stats?.salesOverTime || []} /><section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-black">Best-selling products</h2><div className="mt-4 space-y-4">{(stats?.bestSellingProducts || []).length ? stats.bestSellingProducts.map((item) => <div key={item._id} className="flex items-center gap-3"><img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover"/><span className="min-w-0 flex-1 truncate text-sm font-semibold">{item.name}</span><span className="text-sm text-gray-500">{item.quantity} sold</span></div>) : <p className="py-5 text-sm text-gray-500">Sales data will appear after orders are placed.</p>}</div><h3 className="mt-6 border-t border-gray-100 pt-5 font-black">Most ordered categories</h3><div className="mt-3 flex flex-wrap gap-2">{(stats?.popularCategories || []).length ? stats.popularCategories.map((item) => <span key={item._id} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold">{item._id} · {item.quantity} items</span>) : <span className="text-sm text-gray-500">No category data yet.</span>}</div></section></div>
          <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm"><div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><h2 className="font-black">Recent orders</h2><button onClick={() => setTab("Orders")} className="text-sm font-bold text-primary">All orders →</button></div><OrdersTable orders={(stats?.recentOrders || [])} onSelect={setSelectedOrder} compact /></section>
        </>}

        {tab === "Products" && <div className="grid items-start gap-6 xl:grid-cols-[360px_1fr]">
          <form onSubmit={saveProduct} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><h2 className="text-lg font-black">{editing ? "Edit product" : "Add a product"}</h2>{editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyProduct); }} className="text-sm text-gray-500">Cancel</button>}</div>
            <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
            <textarea required rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input resize-y" />
            <input required placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="admin-input" />
            <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input" />
            <div className="grid grid-cols-2 gap-3"><input required min="0" type="number" step="0.01" placeholder="Price (Rwf)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="admin-input" /><input required min="0" type="number" step="1" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="admin-input" /></div>
            <button disabled={busy} className="w-full rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white hover:bg-primary disabled:opacity-50">{busy ? "Saving…" : editing ? "Save changes" : "Add product"}</button>
          </form>
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-gray-100 px-5 py-4"><h2 className="font-black">Product inventory <span className="ml-1 text-sm font-semibold text-gray-400">{products.length}</span></h2></div><div className="divide-y divide-gray-100">{products.map((product) => <div key={product._id} className="flex items-center gap-4 px-5 py-4"><img src={product.image} alt="" className="h-14 w-14 rounded-xl bg-gray-100 object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-bold">{product.name}</p><p className="text-sm text-gray-500">{product.category} · {money(product.price)}</p><span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${product.stock === 0 ? "bg-red-100 text-red-700" : product.stock <= 5 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>{product.stock === 0 ? "Out of stock" : product.stock <= 5 ? `${product.stock} in stock · Low` : `${product.stock} in stock`}</span></div><button onClick={() => editProduct(product)} className="text-sm font-bold text-primary">Edit</button><button onClick={() => deleteProduct(product)} className="text-sm font-bold text-red-600">Delete</button></div>)}</div></section>
        </div>}

        {tab === "Orders" && <section className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-gray-100 px-5 py-4"><h2 className="font-black">Orders <span className="ml-1 text-sm font-semibold text-gray-400">{orders.length}</span></h2></div><OrdersTable orders={orders} onSelect={setSelectedOrder} /></section>}
        {tab === "Customers" && <section className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-gray-100 px-5 py-4"><h2 className="font-black">Customers <span className="ml-1 text-sm font-semibold text-gray-400">{customers.length}{customers.length === 250 ? "+" : ""}</span></h2></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3">Orders</th></tr></thead><tbody className="divide-y divide-gray-100">{customers.map((customer) => <tr key={customer._id}><td className="px-5 py-4 font-bold">{customer.name}</td><td className="px-5 py-4 text-gray-600">{customer.email}</td><td className="px-5 py-4 capitalize">{customer.role}</td><td className="px-5 py-4 text-gray-600">{new Date(customer.createdAt).toLocaleDateString()}</td><td className="px-5 py-4 font-semibold">{customer.orderCount}</td></tr>)}</tbody></table></div></section>}
      </main>
      <style>{`.admin-input{width:100%;border:1px solid #e5e7eb;border-radius:.75rem;padding:.7rem .85rem;font-size:.875rem;outline:none}.admin-input:focus{border-color:#a855f7}`}</style>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={async (id, status) => { await changeStatus(id, status); setSelectedOrder((current) => current ? { ...current, status } : current); }} />}
    </div>
  );
};

const OrdersTable = ({ orders, onSelect, compact = false }) => (
  <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Details</th></tr></thead><tbody className="divide-y divide-gray-100">{orders.length ? orders.map((order) => <tr key={order._id}><td className="px-5 py-4 font-bold">#{order._id.slice(-7).toUpperCase()}<p className="mt-1 font-normal text-gray-500">{order.items?.length || 0} item types</p></td><td className="px-5 py-4">{order.customer?.name}<p className="text-xs text-gray-500">{order.customer?.email}</p></td><td className="px-5 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td><td className="px-5 py-4 font-bold">{money(order.totalPrice)}</td><td className="px-5 py-4"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold capitalize">{order.status}</span></td><td className="px-5 py-4"><button onClick={() => onSelect(order)} className="font-bold text-primary">View</button></td></tr>) : <tr><td colSpan="6" className="px-5 py-10 text-center text-gray-500">{compact ? "No orders yet." : "No orders found."}</td></tr>}</tbody></table></div>
);

const SalesChart = ({ points }) => {
  const maxValue = Math.max(...points.map((point) => point.revenue), 1);
  const coordinates = points.map((point, index) => `${points.length < 2 ? 50 : (index / (points.length - 1)) * 100},${100 - (point.revenue / maxValue) * 85}`).join(" ");
  return <section className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-black">Sales over time</h2><p className="mt-1 text-xs text-gray-500">Monthly revenue · last 12 months</p></div><span className="text-xs font-bold text-primary">Rwf</span></div><div className="mt-5 h-48"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Monthly revenue chart" className="h-full w-full overflow-visible"><line x1="0" y1="99" x2="100" y2="99" stroke="#e5e7eb" strokeWidth="0.6"/><polyline points={coordinates} fill="none" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"/>{points.map((point, index) => <circle key={point.month} cx={points.length < 2 ? 50 : (index / (points.length - 1)) * 100} cy={100 - (point.revenue / maxValue) * 85} r="1.4" fill="#8b5cf6"><title>{point.month}: {money(point.revenue)}</title></circle>)}</svg></div><div className="mt-2 flex justify-between text-[10px] text-gray-400"><span>{points[0]?.month}</span><span>{points[Math.floor(points.length / 2)]?.month}</span><span>{points.at(-1)?.month}</span></div></section>;
};

const OrderDetailsModal = ({ order, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    setSaving(true); setError("");
    try { await onUpdate(order._id, status); }
    catch (updateError) { setError(updateError.message); }
    finally { setSaving(false); }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="order-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Order details</p><h2 id="order-detail-title" className="mt-1 text-2xl font-black">#{order._id.slice(-7).toUpperCase()}</h2></div><button onClick={onClose} aria-label="Close order details" className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-gray-100">×</button></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><div className="rounded-2xl bg-gray-50 p-4"><h3 className="font-black">Customer</h3><p className="mt-2 text-sm">{order.customer?.name}</p><p className="text-sm text-gray-600">{order.customer?.email}</p><p className="mt-2 text-sm">{order.customer?.phone}</p><p className="mt-1 text-sm text-gray-600">{order.customer?.address}</p></div><div className="rounded-2xl bg-gray-50 p-4"><h3 className="font-black">Order info</h3><p className="mt-2 text-sm text-gray-600">Placed {new Date(order.createdAt).toLocaleString()}</p><p className="mt-2 text-sm text-gray-600">{order.items?.reduce((sum, item) => sum + item.quantity, 0)} items</p><p className="mt-2 text-lg font-black">{money(order.totalPrice)}</p></div></div><h3 className="mt-6 font-black">Products</h3><div className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-100">{order.items?.map((item, index) => <div key={`${item.productId}-${index}`} className="flex items-center gap-3 p-3"><img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover"/><span className="min-w-0 flex-1 truncate text-sm font-semibold">{item.name}</span><span className="text-sm text-gray-500">{item.quantity} × {money(item.price)}</span><span className="text-sm font-bold">{money(item.price * item.quantity)}</span></div>)}</div><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-bold">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 font-semibold capitalize">{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><button disabled={saving || status === order.status} onClick={submit} className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40">{saving ? "Updating…" : "Update order"}</button></div>{error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p>}</section></div>;
};

export default AdminDashboard;
