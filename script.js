// Helpers
const formatVND = n => (n).toLocaleString('vi-VN') + 'đ';

// ====== Modal chi tiết món ======
const modal = document.getElementById('dish-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalAdd = document.getElementById('modal-add');
const closeDishModal = () => modal.classList.add('hidden');
modal.querySelector('.modal-close').addEventListener('click', closeDishModal);
modal.addEventListener('click', e => { if (e.target === modal) closeDishModal(); });

// ====== Giỏ hàng ======
const cartEl = document.getElementById('cart');
const cartBtn = document.getElementById('cart-btn');
const cartClose = document.getElementById('cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const grandEl = document.getElementById('grand');
const checkoutBtn = document.getElementById('checkout-btn');

let CART = []; // {id,title,price,qty,img}

const openCart = () => cartEl.classList.remove('hidden');
const closeCart = () => cartEl.classList.add('hidden');
cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);

// Lưu/đọc LocalStorage (giữ giỏ khi reload)
const saveCart = () => localStorage.setItem('nhahang_cart', JSON.stringify(CART));
const loadCart = () => {
  try { CART = JSON.parse(localStorage.getItem('nhahang_cart')) || []; }
  catch { CART = []; }
};
loadCart();

// Render giỏ
function renderCart(){
  cartItemsEl.innerHTML = '';
  let subtotal = 0;

  CART.forEach(item => {
    subtotal += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div>
        <strong>${item.title}</strong>
        <div class="price">${formatVND(item.price)}</div>
      </div>
      <div class="qty">
        <button data-act="dec" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button data-act="inc" data-id="${item.id}">+</button>
        <button data-act="rm" data-id="${item.id}" title="Xóa">🗑️</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  const vat = Math.round(subtotal * 0.08);
  const grand = subtotal + vat;

  subtotalEl.textContent = formatVND(subtotal);
  vatEl.textContent = formatVND(vat);
  grandEl.textContent = formatVND(grand);
  cartCountEl.textContent = CART.reduce((a,b)=>a+b.qty,0);

  saveCart();
}
renderCart();

// Sự kiện tăng/giảm/xóa
cartItemsEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.act;
  const item = CART.find(i=>i.id===id);
  if(!item) return;

  if(act==='inc') item.qty++;
  if(act==='dec') item.qty = Math.max(1, item.qty-1);
  if(act==='rm')  CART = CART.filter(i=>i.id!==id);

  renderCart();
});

// Thêm vào giỏ
function addToCart({id,title,price,img}){
  const found = CART.find(i=>i.id===id);
  if(found) found.qty++;
  else CART.push({id,title,price,qty:1,img});
  renderCart();
  openCart();
}

// ====== Bắt hành vi trên các thẻ món ăn ======
document.querySelectorAll('.card').forEach(card=>{
  const id = card.dataset.id;
  const title = card.dataset.title;
  const price = Number(card.dataset.price);
  const desc = card.dataset.desc;
  const img = card.querySelector('img').getAttribute('src');

  // Nút chi tiết
  card.querySelector('.view-btn').addEventListener('click', ()=>{
    modalImg.src = img;
    modalTitle.textContent = title;
    modalPrice.textContent = formatVND(price);
    modalDesc.textContent = desc;
    modal.dataset.id = id;
    modal.dataset.title = title;
    modal.dataset.price = price;
    modal.dataset.img = img;
    modal.classList.remove('hidden');
  });

  // Nút thêm vào giỏ trên card
  card.querySelector('.add-btn').addEventListener('click', ()=>{
    addToCart({id,title,price,img});
  });
});

// Nút thêm vào giỏ trong modal chi tiết
modalAdd.addEventListener('click', ()=>{
  addToCart({
    id: modal.dataset.id,
    title: modal.dataset.title,
    price: Number(modal.dataset.price),
    img: modal.dataset.img
  });
  closeDishModal();
});

// ====== Checkout (mock form) ======
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = () => checkoutModal.classList.add('hidden');
document.querySelector('[data-close-checkout]').addEventListener('click', closeCheckout);
checkoutModal.addEventListener('click', e => { if (e.target===checkoutModal) closeCheckout(); });

checkoutBtn.addEventListener('click', ()=>{
  if(CART.length===0){ alert('Giỏ hàng đang trống!'); return; }
  checkoutModal.classList.remove('hidden');
});

// Gửi form
document.getElementById('checkout-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  // Ở đây bạn có thể gọi API gửi đơn về backend/Google Sheets/Zalo OA…
  alert(
    `Đặt hàng thành công!\n\nKhách: ${data.name}\nĐiện thoại: ${data.phone}\nĐịa chỉ: ${data.address}\nMón: ${CART.map(i=>`${i.title} x${i.qty}`).join(', ')}\nTổng: ${grandEl.textContent}`
  );
  CART = []; renderCart(); closeCheckout(); closeCart();
});
// ====== Form Liên hệ ======
document.getElementById('contact-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  
  // Hiện thông báo (sau này có thể đổi thành gửi lên Google Sheets hoặc Email API)
  alert(
    `Cám ơn ${data.name} đã liên hệ!\n\n` +
    `Email: ${data.email}\n` +
    `Điện thoại: ${data.phone}\n` +
    `Lời nhắn: ${data.message}\n\n` +
    `Chúng tôi sẽ phản hồi sớm nhất.`
  );
  
  e.target.reset();
});
// ====== Reviews ======
const reviewList = document.getElementById('review-list');
const reviewForm = document.getElementById('review-form');

// Hàm vẽ số sao
function renderStars(n) {
  return '⭐'.repeat(n) + '☆'.repeat(5-n);
}

// Xử lý gửi review
reviewForm.addEventListener('submit', e=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(reviewForm).entries());
  const rating = Number(data.rating);

  // Tạo phần tử review
  const div = document.createElement('div');
  div.className = 'review-item';
  div.innerHTML = `
    <strong>${data.name}</strong>
    <div class="stars">${renderStars(rating)}</div>
    <p>${data.comment || '(Không có nhận xét chi tiết)'}</p>
  `;

  reviewList.prepend(div); // thêm vào đầu danh sách
  alert('Cảm ơn bạn đã đánh giá!');

  reviewForm.reset();
});
// ====== Form Đặt bàn ======
document.getElementById('reservation-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  alert(
    `Cảm ơn ${data.name} đã đặt bàn!\n\n` +
    `Số điện thoại: ${data.phone}\n` +
    `Số khách: ${data.guests}\n` +
    `Thời gian: ${data.date} lúc ${data.time}\n` +
    `Ghi chú: ${data.note || '(Không có)'}\n\n` +
    `Nhà hàng sẽ liên hệ xác nhận sớm nhất.`
  );

  e.target.reset();
});
