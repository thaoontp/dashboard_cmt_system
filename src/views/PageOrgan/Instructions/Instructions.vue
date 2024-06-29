<template>
    <div class="guide-container">
      <h4 class="guide-title">Hướng dẫn sử dụng hệ thống</h4>
      <hr>
      <div class="guide-content">
        <section class="guide-section">
          <h2 class="section-title">Bước 1: Đăng ký tài khoản</h2>
          <p class="section-description">
            Đầu tiên, bạn cần đăng ký tài khoản trên trang web của chúng tôi để bắt đầu sử dụng dịch vụ.
          </p>
        </section>
        <section class="guide-section">
          <h2 class="section-title">Bước 2: Đăng nhập và quản lý tài khoản</h2>
          <p class="section-description">
            Sau khi đăng ký thành công, đăng nhập vào tài khoản để quản lý thông tin cá nhân và tài nguyên của bạn.
          </p>
        </section>
        <section class="guide-section">
          <h2 class="section-title">Bước 3: Sử dụng các tính năng chính</h2>
          <p class="section-description">
            Khám phá và sử dụng các tính năng như quản lý đơn hàng, thực hiện thanh toán, và tương tác với dịch vụ của chúng tôi.
          </p>
        </section>
        <section class="guide-section">
          <h2 class="section-title">Bước 4: Hỗ trợ và liên hệ</h2>
          <p class="section-description">
            Nếu bạn gặp bất kỳ vấn đề nào trong quá trình sử dụng, vui lòng liên hệ với chúng tôi để được hỗ trợ chi tiết.
          </p>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GuidePage'
  };
  </script>
  
  <style scoped>
  .guide-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .guide-title {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .guide-content {
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .section-title {
    color: #1890ff;
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .section-description {
    color: #666;
    font-size: 16px;
    line-height: 1.6;
  }

  hr{
    display: block;
    border: none;
    height: 3px;
    background-color: #198754;
    margin: 0px;
  }
  </style>
  