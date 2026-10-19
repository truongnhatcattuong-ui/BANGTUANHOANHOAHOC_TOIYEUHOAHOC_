// Đặt tên cho bộ nhớ đệm (thay đổi tên/phiên bản này nếu bạn có cập nhật code mới sau này)
const CACHE_NAME = "periodic-table-v1";

// Danh sách các file cốt lõi cần tải sẵn vào máy người dùng
const ASSETS_TO_CACHE = [
  "./",             // Lưu trữ đường dẫn gốc
  "./index.html",   // Giao diện
  "./style.css",    // Định dạng
  "./script.js"     // Logic xử lý
];

// SỰ KIỆN 1: CÀI ĐẶT (INSTALL)
// Chạy lần đầu tiên khi người dùng vào web. Nó sẽ tải toàn bộ danh sách ASSETS_TO_CACHE về máy.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Đã lưu trữ bộ đệm (Cache) thành công!");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// SỰ KIỆN 2: CHẶN YÊU CẦU TẢI (FETCH)
// Khi web cần tải một file (html, css, js), nó sẽ hỏi Service Worker trước.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Nếu file đã có trong máy (offline) -> Trả về file đó ngay lập tức
      if (cachedResponse) {
        return cachedResponse;
      }
      // Nếu chưa có -> Bắt buộc phải lên mạng tải về
      return fetch(event.request);
    })
  );
});

// SỰ KIỆN 3: DỌN DẸP BỘ NHỚ CŨ (ACTIVATE)
// Xóa các bộ nhớ đệm của phiên bản cũ nếu bạn thay đổi CACHE_NAME (ví dụ từ v1 lên v2)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});