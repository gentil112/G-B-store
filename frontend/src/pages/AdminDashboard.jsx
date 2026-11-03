import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBox,
  FiChevronRight,
  FiGrid,
  FiPlus,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
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

  const navItems = [
    { label: "Overview", icon: FiGrid },
    { label: "Products", icon: FiBox },
    { label: "Orders", icon: FiShoppingBag },
    { label: "Customers", icon: FiUsers },
  ];

  return (
    <div className="admin-shell min-h-screen bg-[#fcfaf7] text-[#26211b]">
      <div className="min-h-screen lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="admin-sidebar flex flex-col px-5 pb-4 pt-6 text-white lg:sticky lg:top-0 lg:h-screen lg:px-7 lg:py-8">
          <Link to="/" className="flex items-center gap-3" aria-label="G&B Store home">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-serif text-lg text-white shadow-md">G&B</span>
            <span><span className="block text-sm font-semibold tracking-[0.2em]">G&B STORE</span><span className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-white/45">Maison de style</span></span>
          </Link>
          <p className="mb-3 mt-10 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35 lg:block">Workspace</p>
          <nav className="mt-6 flex gap-2 overflow-x-auto lg:mt-0 lg:flex-col" aria-label="Dashboard sections">
            {navItems.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => setTab(label)} aria-current={tab === label ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${tab === label ? "bg-primary font-semibold text-[#26211b] shadow-lg shadow-black/10" : "text-white/60 hover:bg-white/8 hover:text-white"}`}>
                {React.createElement(Icon, { size: 17, strokeWidth: 1.7 })}{label}
                {label === "Orders" && stats?.orderStatuses?.pending > 0 && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${tab === label ? "bg-black/10" : "bg-white/10"}`}>{stats.orderStatuses.pending}</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:block">
            <p className="text-xs font-semibold">Need a little inspiration?</p>
            <p className="mt-1 text-xs leading-5 text-white/45">Your storefront is always one click away.</p>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#d4ad7e] hover:text-white">Visit your store <FiArrowUpRight size={14} /></Link>
          </div>
          <div className="mt-4 hidden items-center gap-3 border-t border-white/10 pt-5 lg:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9b754b] text-xs font-bold text-[#1c1a17]">{user?.name?.slice(0, 1)?.toUpperCase() || "A"}</span>
            <span className="min-w-0"><span className="block truncate text-xs font-semibold">{user?.name || "Store administrator"}</span><span className="mt-1 block text-[10px] text-white/40">Store administrator</span></span>
          </div>
        </aside>
        <div className="min-w-0">
          <header className="flex items-center justify-between border-b border-[#b99467]/20 bg-[#f4efe8] px-5 py-4 sm:px-8 lg:px-10">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b754b]">G&B / {tab}</p><h1 className="mt-1 font-serif text-xl text-[#26211b] sm:text-2xl">{tab === "Overview" ? "The house at a glance" : tab}</h1></div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden text-xs text-[#8b857b] sm:inline">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
              <button onClick={loadDashboard} aria-label="Refresh dashboard" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4ded3] text-[#746b5e] transition hover:border-[#9b754b] hover:text-[#9b754b]"><FiRefreshCw size={15} /></button>
              <Link to="/" className="rounded-full bg-[#26211b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#9b754b]">View store <span aria-hidden="true">↗</span></Link>
            </div>
          </header>
          <main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
            {notice && <div role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{notice}</div>}

            {tab === "Overview" && <>
              <section className="admin-hero relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-9 sm:py-10">
                <div className="relative z-10 max-w-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d4ad7e]">Your atelier, in focus</p>
                  <h2 className="mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl">A considered view of your business.</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/55">A little clarity goes a long way. Here’s how your store is performing today.</p>
                  <button onClick={() => setTab("Orders")} className="mt-6 inline-flex items-center gap-2 border-b border-[#9b754b] pb-1 text-xs font-semibold text-[#d4ad7e] transition hover:text-white">Review your orders <FiChevronRight size={14} /></button>
                </div>
                <div className="admin-hero-mark absolute -right-7 -top-20 hidden font-serif text-[340px] leading-none text-white/[0.035] md:block" aria-hidden="true">G</div>
                <div className="absolute bottom-8 right-10 hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur md:flex">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9b754b]/15 text-[#d4ad7e]"><FiArrowUpRight size={18} /></span>
                  <span><span className="block text-[10px] uppercase tracking-[0.16em] text-white/45">Lifetime revenue</span><span className="mt-1 block font-serif text-xl">{money(stats?.revenue)}</span></span>
                </div>
              </section>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Gross revenue", value: money(stats?.revenue), note: "Lifetime · excl. cancelled", icon: FiArrowUpRight, tone: "gold" },
                  { label: "Orders placed", value: stats?.orders, note: `${stats?.orderStatuses?.pending || 0} awaiting attention`, icon: FiShoppingBag, tone: "dark" },
                  { label: "Pieces in the edit", value: stats?.products, note: `${stats?.lowStock || 0} styles running low`, icon: FiBox, tone: "cream" },
                  { label: "Our clientele", value: stats?.customers, note: "Registered customers", icon: FiUsers, tone: "cream" },
                ].map(({ label, value, note, icon: Icon, tone }) => (
                  <section key={label} className="admin-card rounded-2xl border border-[#b99467]/20 bg-[#fbf9f5] p-5">
                    <div className="flex items-center justify-between"><p className="text-xs font-medium text-[#847d72]">{label}</p><span className={`flex h-9 w-9 items-center justify-center rounded-full ${tone === "gold" ? "bg-[#fea928]/15 text-[#ed8900]" : tone === "dark" ? "bg-[#26211b] text-[#d4ad7e]" : "bg-[#f2ece4] text-[#716a5f]"}`}>{React.createElement(Icon, { size: 16 })}</span></div>
                    <p className="mt-4 font-serif text-[28px] tracking-tight text-[#26211b]">{value ?? "—"}</p>
                    <p className="mt-1 text-[11px] text-[#a29b90]">{note}</p>
                  </section>
                ))}
              </div>
              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
                <SalesChart points={stats?.salesOverTime || []} />
                <section className="admin-card rounded-2xl border border-[#b99467]/20 bg-[#fbf9f5] p-5 sm:p-6">
                  <div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#9b754b]">The collection</p><h2 className="mt-1 font-serif text-xl">Bestsellers</h2></div><span className="text-[10px] text-[#9c9589]">BY PIECES SOLD</span></div>
                  <div className="mt-5 space-y-4">{(stats?.bestSellingProducts || []).length ? stats.bestSellingProducts.map((item, index) => <div key={item._id} className="flex items-center gap-3"><span className="w-4 text-[10px] text-[#aaa294]">0{index + 1}</span><img src={item.image} alt="" className="h-12 w-12 rounded-xl bg-[#f1eee8] object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#38342d]">{item.name}</span><span className="mt-1 block text-[10px] text-[#a29b90]">{item.quantity} pieces sold</span></span><FiArrowUpRight className="text-[#9b754b]" size={15} /></div>) : <p className="py-5 text-sm text-[#8a8378]">Your bestsellers will appear as orders come in.</p>}</div>
                  <div className="mt-6 border-t border-[#eee9e0] pt-5"><div className="flex items-center justify-between"><h3 className="font-serif text-base">Most-loved categories</h3><span className="text-[10px] text-[#a29b90]">BY UNITS</span></div><div className="mt-3 flex flex-wrap gap-2">{(stats?.popularCategories || []).length ? stats.popularCategories.map((item) => <span key={item._id} className="rounded-full border border-[#e7e0d4] px-3 py-1.5 text-[11px] capitalize text-[#6e665b]">{item._id} <span className="ml-1 text-[#9b754b]">{item.quantity}</span></span>) : <span className="text-sm text-[#8a8378]">Category insights will appear here.</span>}</div></div>
                </section>
              </div>
              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
                <section className="admin-card overflow-hidden rounded-2xl border border-[#b99467]/20 bg-[#fbf9f5]">
                  <div className="flex items-center justify-between border-b border-[#eee9e0] px-5 py-4 sm:px-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#9b754b]">Just in</p><h2 className="mt-1 font-serif text-xl">Recent orders</h2></div><button onClick={() => setTab("Orders")} className="inline-flex items-center gap-1 text-xs font-semibold text-[#9b754b] hover:text-[#39342b]">All orders <FiChevronRight size={14} /></button></div>
                  <OrdersTable orders={(stats?.recentOrders || [])} onSelect={setSelectedOrder} compact />
                </section>
                <section className="admin-card rounded-2xl border border-[#b99467]/20 bg-[#fbf9f5] p-5 sm:p-6">
                  <div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#9b754b]">At a glance</p><h2 className="mt-1 font-serif text-xl">Order pulse</h2></div><FiShoppingBag className="text-[#9b754b]" size={17} /></div>
                  <div className="mt-5 space-y-4">{[["Pending", stats?.orderStatuses?.pending || 0], ["Processing", stats?.orderStatuses?.processing || 0], ["Shipped", stats?.orderStatuses?.shipped || 0], ["Delivered", stats?.orderStatuses?.delivered || 0]].map(([label, value]) => <div key={label}><div className="mb-2 flex justify-between text-xs"><span className="text-[#716b61]">{label}</span><span className="font-semibold text-[#38342d]">{value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#f0ece4]"><div className="h-full rounded-full bg-[#9b754b]" style={{ width: `${Math.min(100, stats?.orders ? (value / stats.orders) * 100 : 0)}%` }} /></div></div>)}</div>
                  <button onClick={() => setTab("Products")} className="mt-6 flex w-full items-center justify-between rounded-xl bg-[#f4efe8] px-4 py-3 text-left transition hover:bg-[#f2ece4]"><span><span className="block text-xs font-semibold text-[#4c463c]">Inventory watch</span><span className="mt-1 block text-[10px] text-[#91897d]">{stats?.lowStock || 0} low · {stats?.outOfStock || 0} out of stock</span></span><FiChevronRight className="text-[#9b754b]" size={16} /></button>
                </section>
              </div>
            </>}

            {tab === "Products" && <div className="grid items-start gap-6 xl:grid-cols-[360px_1fr]">
          <form onSubmit={saveProduct} className="admin-card space-y-3 rounded-2xl border border-black/[0.06] bg-[#fbf9f5] p-5">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#9b754b]">{editing ? "Update the edit" : "Grow your collection"}</p><h2 className="mt-1 font-serif text-xl">{editing ? "Edit product" : "Add a product"}</h2></div>{editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyProduct); }} className="text-sm text-[#8c8478] hover:text-[#322f29]">Cancel</button>}</div>
            <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
            <textarea required rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input resize-y" />
            <input required placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="admin-input" />
            <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input" />
            <div className="grid grid-cols-2 gap-3"><input required min="0" type="number" step="0.01" placeholder="Price (Rwf)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="admin-input" /><input required min="0" type="number" step="1" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="admin-input" /></div>
            <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#26211b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#9b754b] disabled:opacity-50">{busy ? "Saving…" : editing ? "Save changes" : <><FiPlus size={15} /> Add product</>}</button>
          </form>
          <section className="admin-card overflow-hidden rounded-2xl border border-[#b99467]/20 bg-[#fbf9f5]"><div className="border-b border-[#b99467]/20 px-5 py-4"><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#9b754b]">Your assortment</p><h2 className="mt-1 font-serif text-xl">Product inventory <span className="ml-1 font-sans text-sm font-medium text-[#a29b90]">{products.length}</span></h2></div><div className="divide-y divide-[#b99467]/15">{products.length ? products.map((product) => <div key={product._id} className="flex items-center gap-4 px-5 py-4"><img src={product.image} alt="" className="h-14 w-14 rounded-xl bg-[#f2ece4] object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#38342d]">{product.name}</p><p className="text-xs capitalize text-[#8d867b]">{product.category} · {money(product.price)}</p><span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${product.stock === 0 ? "bg-red-50 text-red-700" : product.stock <= 5 ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-800"}`}>{product.stock === 0 ? "Out of stock" : product.stock <= 5 ? `${product.stock} in stock · Low` : `${product.stock} in stock`}</span></div><button onClick={() => editProduct(product)} className="text-xs font-semibold text-[#9b754b] hover:text-[#322f29]">Edit</button><button onClick={() => deleteProduct(product)} className="text-xs font-semibold text-red-600">Delete</button></div>) : <p className="px-5 py-12 text-center text-sm text-[#8d867b]">Your product collection is waiting to be added.</p>}</div></section>
        </div>}

        {tab === "Orders" && <section className="admin-card overflow-hidden rounded-2xl border border-[#b99467]/20 bg-[#fbf9f5]"><div className="border-b border-[#b99467]/20 px-5 py-4"><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#9b754b]">Clienteling</p><h2 className="mt-1 font-serif text-xl">Orders <span className="ml-1 font-sans text-sm font-medium text-[#a29b90]">{orders.length}</span></h2></div><OrdersTable orders={orders} onSelect={setSelectedOrder} /></section>}
        {tab === "Customers" && <section className="admin-card overflow-hidden rounded-2xl border border-[#b99467]/20 bg-[#fbf9f5]"><div className="border-b border-[#b99467]/20 px-5 py-4"><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#9b754b]">The people behind every order</p><h2 className="mt-1 font-serif text-xl">Customers <span className="ml-1 font-sans text-sm font-medium text-[#a29b90]">{customers.length}{customers.length === 250 ? "+" : ""}</span></h2></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="admin-table-head"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3">Orders</th></tr></thead><tbody className="divide-y divide-[#b99467]/15">{customers.map((customer) => <tr key={customer._id} className="admin-table-row"><td className="px-5 py-4 font-semibold">{customer.name}</td><td className="px-5 py-4 text-[#797267]">{customer.email}</td><td className="px-5 py-4 capitalize">{customer.role}</td><td className="px-5 py-4 text-[#797267]">{new Date(customer.createdAt).toLocaleDateString()}</td><td className="px-5 py-4 font-semibold">{customer.orderCount}</td></tr>)}</tbody></table></div></section>}
          </main>
        </div>
      </div>
      <style>{`.admin-input{width:100%;border:1px solid #e5dfd4;border-radius:.75rem;background:#fffefa;padding:.75rem .85rem;font-size:.875rem;color:#332f29;outline:none;transition:border-color .2s,box-shadow .2s}.admin-input::placeholder{color:#aaa397}.admin-input:focus{border-color:#9b754b;box-shadow:0 0 0 3px rgb(183 155 109 / 12%)}.admin-table-head{background:#f7f4ee;color:#8e867a;font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}.admin-table-row{color:#514b41}.admin-table-row:hover{background:#faf8f3}.admin-sidebar{background:radial-gradient(ellipse at 30% 0%,#3b3026 0%,#211d19 52%,#171411 100%)}.admin-hero{background:radial-gradient(ellipse at 78% 20%,rgb(155 117 75 / 20%),transparent 38%),linear-gradient(112deg,#26211b 0%,#211d19 55%,#171411 100%)}.admin-card{box-shadow:0 12px 35px rgb(55 35 20 / 7%)}@media(max-width:1023px){.admin-sidebar{background:#211d19}}`}</style>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={async (id, status) => { await changeStatus(id, status); setSelectedOrder((current) => current ? { ...current, status } : current); }} />}
    </div>
  );
};

const OrdersTable = ({ orders, onSelect, compact = false }) => (
  <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="admin-table-head"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Details</th></tr></thead><tbody className="divide-y divide-[#eee9e0]">{orders.length ? orders.map((order) => <tr key={order._id} className="admin-table-row"><td className="px-5 py-4 font-semibold">#{order._id.slice(-7).toUpperCase()}<p className="mt-1 text-[11px] font-normal text-[#999185]">{order.items?.length || 0} item types</p></td><td className="px-5 py-4">{order.customer?.name}<p className="text-[11px] text-[#999185]">{order.customer?.email}</p></td><td className="px-5 py-4 text-[#797267]">{new Date(order.createdAt).toLocaleDateString()}</td><td className="px-5 py-4 font-semibold">{money(order.totalPrice)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${order.status === "delivered" ? "bg-green-50 text-green-700" : order.status === "cancelled" ? "bg-red-50 text-red-700" : order.status === "pending" ? "bg-amber-50 text-amber-800" : "bg-[#f1eee8] text-[#716a5f]"}`}>{order.status}</span></td><td className="px-5 py-4"><button onClick={() => onSelect(order)} className="font-semibold text-[#9b754b] hover:text-[#322f29]">View</button></td></tr>) : <tr><td colSpan="6" className="px-5 py-10 text-center text-sm text-[#8d867b]">{compact ? "No orders yet." : "No orders found."}</td></tr>}</tbody></table></div>
);

const SalesChart = ({ points }) => {
  const maxValue = Math.max(...points.map((point) => point.revenue), 1);
  const coordinates = points.map((point, index) => `${points.length < 2 ? 50 : (index / (points.length - 1)) * 100},${100 - (point.revenue / maxValue) * 82}`).join(" ");
  const areaCoordinates = `${coordinates} 100,100 0,100`;
  const monthLabel = (month) => {
    const date = new Date(`${month}-01T00:00:00`);
    return Number.isNaN(date.getTime()) ? month : date.toLocaleDateString(undefined, { month: "short" });
  };
  return <section className="admin-card rounded-2xl border border-[#b99467]/20 bg-[#fbf9f5] p-5 sm:p-6">
    <div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#9b754b]">A twelve-month view</p><h2 className="mt-1 font-serif text-xl">Revenue, over time</h2></div><span className="rounded-full border border-[#e7e0d4] px-3 py-1.5 text-[10px] font-semibold text-[#8b7654]">RWF</span></div>
    <div className="mt-5 h-48 sm:h-56"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Monthly revenue chart" className="h-full w-full overflow-visible">
      <defs><linearGradient id="sales-area-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#fea928" stopOpacity=".25" /><stop offset="100%" stopColor="#fea928" stopOpacity="0" /></linearGradient></defs>
      {[20, 45, 70, 99].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#eee9e0" strokeWidth=".45" vectorEffect="non-scaling-stroke" />)}
      <polygon points={areaCoordinates} fill="url(#sales-area-gradient)" />
      <polyline points={coordinates} fill="none" stroke="#ed8900" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((point, index) => <circle key={point.month} cx={points.length < 2 ? 50 : (index / (points.length - 1)) * 100} cy={100 - (point.revenue / maxValue) * 82} r="1.5" fill="#fbf9f5" stroke="#ed8900" strokeWidth=".8" vectorEffect="non-scaling-stroke"><title>{point.month}: {money(point.revenue)}</title></circle>)}
    </svg></div>
    <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.1em] text-[#aaa397]"><span>{monthLabel(points[0]?.month || "")}</span><span>{monthLabel(points[Math.floor(points.length / 2)]?.month || "")}</span><span>{monthLabel(points.at(-1)?.month || "")}</span></div>
  </section>;
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
