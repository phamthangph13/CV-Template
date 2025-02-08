document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const applyBtn = document.querySelector('.apply-btn');
    const backgroundMusic = document.getElementById('backgroundMusic');

    // Thêm ribbon wrapper vào đầu body
    const ribbonWrapper = document.createElement('div');
    ribbonWrapper.className = 'ribbon-wrapper';
    ribbonWrapper.innerHTML = `
        <div class="ribbon">
            <div class="ribbon-center"></div>
            <div class="ribbon-text">Touch Here❤️</div>
        </div>
    `;
    document.body.insertBefore(ribbonWrapper, document.body.firstChild);

    const ribbon = document.querySelector('.ribbon');
    const ribbonText = document.querySelector('.ribbon-text');

    // Xử lý sự kiện click vào ribbon
    ribbonWrapper.addEventListener('click', function() {
        ribbonText.classList.add('fade');
        playMusic(); // Thêm phát nhạc ngay khi click
        
        setTimeout(() => {
            ribbon.classList.add('unwrap');
            
            // Thêm chữ Trung Quốc sau 2s
            setTimeout(() => {
                const chineseText = document.createElement('div');
                chineseText.className = 'chinese-text';
                chineseText.innerHTML = `
                    祝你早日成为我的另一半<br>
                    <span style="font-size: 0.7em; color: #ff4b6e;">
                        Chúc em sớm trở thành một nửa của anh
                    </span>
                `;
                document.body.appendChild(chineseText);
                
                setTimeout(() => {
                    chineseText.classList.add('show');
                }, 100);
                
                setTimeout(() => {
                    chineseText.remove();
                }, 6000);
            }, 2000);
            
            // Chỉ xóa ribbon sau 8s, không cần gọi playMusic() nữa
            setTimeout(() => {
                ribbonWrapper.remove();
            }, 8000);
        }, 500);
    });

    // Cập nhật hàm playMusic
    function playMusic() {
        backgroundMusic.volume = 0;  // Bắt đầu với âm lượng 0
        backgroundMusic.play();
        backgroundMusic.loop = true;
        
        // Tăng dần âm lượng
        let vol = 0;
        const fadeIn = setInterval(() => {
            if (vol < 1) {
                vol += 0.1;
                backgroundMusic.volume = vol;
            } else {
                clearInterval(fadeIn);
            }
        }, 100);
    }

    // Tạo các button mới
    const decisionBtns = document.createElement('div');
    decisionBtns.className = 'decision-btns';
    decisionBtns.innerHTML = `
        <button class="agree-btn">Đồng ý</button>
        <button class="strongly-agree-btn">Rất đồng ý</button>
    `;
    
    // Chèn vào sau nút apply
    applyBtn.parentNode.insertBefore(decisionBtns, applyBtn.nextSibling);

    applyBtn.addEventListener('click', function() {
        // Ẩn nút apply với animation
        applyBtn.classList.add('split');
        
        // Hiện 2 nút mới sau 500ms
        setTimeout(() => {
            decisionBtns.classList.add('show');
        }, 500);
    });

    // Xử lý sự kiện cho các nút mới
    document.querySelector('.agree-btn').addEventListener('click', function() {
        backgroundMusic.play();  // Ensure music plays on agreement
        Swal.fire({
            title: 'Tuyệt vời!',
            text: 'Bạn đã đồng ý! Chúng ta bắt đầu hành trình mới nhé!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    });

    document.querySelector('.strongly-agree-btn').addEventListener('click', function() {
        backgroundMusic.play();  // Ensure music plays on strong agreement
        Swal.fire({
            title: 'Tuyệt vời!',
            text: 'Bạn đã rất đồng ý! Chúng ta sẽ có một tình yêu tuyệt vời!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    });
});
