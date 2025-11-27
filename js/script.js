document.addEventListener('DOMContentLoaded', () => {
    // --- Bài 1: Carousel ---
    const carouselWrapper = document.querySelector('.carousel-slide-wrapper');
    if (carouselWrapper) {
        const slides = document.querySelectorAll('.carousel-img');
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoSlideInterval;
        
        /**
         * Hàm cập nhật vị trí slide bằng CSS transform (Tối ưu performance)
         */
        const updateCarousel = () => {
            // Tính toán giá trị translateX cần thiết
            const offset = -currentIndex * 100;
            carouselWrapper.style.transform = `translateX(${offset}%)`;
        };
        
        /**
         * Logic xử lý index (Tránh out-of-bound)
         */
        const goToSlide = (index) => {
            // Đảm bảo index luôn nằm trong khoảng [0, totalSlides - 1]
            if (index >= totalSlides) {
                currentIndex = 0; // Quay lại slide đầu tiên
            } else if (index < 0) {
                currentIndex = totalSlides - 1; // Đi đến slide cuối cùng
            } else {
                currentIndex = index;
            }
            updateCarousel();
        };

        // Nút Next
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoSlide();
        });

        // Nút Prev
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoSlide();
        });

        // Tự động chuyển slide sau 3 giây
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 3000); // 3 giây
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };

        // Bắt đầu tự động chạy khi tải trang
        startAutoSlide();
    }
    // --- Kết thúc Bài 1 ---
    
    // ... Tiếp tục các bài 2, 3 ...
});
document.addEventListener('DOMContentLoaded', () => {
    // ... Phần Carousel (Bài 1) ...

    // --- Bài 2: Todo List ---
    const inputElement = document.getElementById('todo-input');
    const addButton = document.getElementById('add-todo-btn');
    const listContainer = document.getElementById('todo-list');
    
    // State của ứng dụng: mảng lưu trữ tất cả tasks
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    /**
     * Lưu mảng state vào LocalStorage
     */
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };
    
    /**
     * Hàm chính: Render lại DOM (Hiệu quả)
     */
    const renderTodos = () => {
        // 1. Dọn dẹp DOM cũ
        listContainer.innerHTML = ''; 
        
        // 2. Render DOM mới từ mảng State
        todos.forEach((todo, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';
            
            // Xây dựng chuỗi HTML cho mỗi task
            todoItem.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <input type="text" class="edit-input" value="${todo.text}">
                <div class="todo-actions">
                    <button class="edit-btn" data-index="${index}">Sửa</button>
                    <button class="delete-btn" data-index="${index}">Xóa</button>
                </div>
            `;
            
            listContainer.appendChild(todoItem);
        });
        
        // 3. Gắn lại Event Listener (Sau khi DOM đã được tạo mới)
        attachEventListeners();
    };

    /**
     * Xử lý thêm task
     */
    const addTask = () => {
        const text = inputElement.value.trim();
        if (text) {
            // Cập nhật State
            todos.push({ text: text, completed: false }); 
            inputElement.value = '';
            
            // Lưu và Render
            saveTodos();
            renderTodos(); 
        }
    };
    
    /**
     * Xử lý xóa task
     */
    const deleteTask = (index) => {
        // Cập nhật State (sử dụng splice để xóa phần tử tại index)
        todos.splice(index, 1);
        
        // Lưu và Render
        saveTodos();
        renderTodos();
    };
    
    /**
     * Xử lý sửa task
     */
    const handleEdit = (event) => {
        const button = event.target;
        const index = parseInt(button.dataset.index);
        const item = button.closest('.todo-item');
        const textSpan = item.querySelector('.todo-text');
        const editInput = item.querySelector('.edit-input');
        
        if (item.classList.contains('editing')) {
            // Lưu thay đổi
            const newText = editInput.value.trim();
            if (newText) {
                todos[index].text = newText; // Cập nhật State
                saveTodos();
                renderTodos(); // Render lại toàn bộ để cập nhật
            }
        } else {
            // Chuyển sang chế độ chỉnh sửa
            item.classList.add('editing');
            button.textContent = 'Lưu';
            editInput.focus();
        }
    };

    /**
     * Gắn Event Listener cho các nút Delete/Edit
     */
    const attachEventListeners = () => {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                deleteTask(index);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
    };

    // Gắn Event Listener cho nút Add
    addButton.addEventListener('click', addTask);
    inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Load tasks khi trang được tải lần đầu
    renderTodos(); 
    // --- Kết thúc Bài 2 ---
    
    // ... Tiếp tục Bài 3 ...
});
document.addEventListener('DOMContentLoaded', () => {
    // ... Phần Carousel (Bài 1) & Todo List (Bài 2) ...

    // --- Bài 3: Game Đoán Số ---
    const guessInput = document.getElementById('guess-input');
    const submitBtn = document.getElementById('submit-guess');
    const resultText = document.getElementById('result-text');
    const attemptsCount = document.getElementById('attempts-count');
    const newGameBtn = document.getElementById('new-game-btn');
    const confettiContainer = document.getElementById('confetti-container');

    let targetNumber;
    let attempts;
    let gameOver;

    /**
     * Logic Tư duy: Generate Random Number (1-100)
     */
    const generateRandomNumber = () => {
        // Math.random() cho số thập phân từ [0, 1)
        // Nhân với 100: [0, 100)
        // Math.floor: [0, 99]
        // Cộng 1: [1, 100]
        return Math.floor(Math.random() * 100) + 1;
    };

    /**
     * Khởi tạo/Chơi lại game
     */
    const initGame = () => {
        targetNumber = generateRandomNumber();
        attempts = 0;
        gameOver = false;
        
        // Reset UI
        resultText.textContent = 'Hãy bắt đầu đoán!';
        resultText.className = 'message';
        attemptsCount.textContent = 'Số lần thử: 0';
        guessInput.value = '';
        guessInput.disabled = false;
        submitBtn.disabled = false;
        confettiContainer.innerHTML = '';
        // console.log("Số bí mật là: " + targetNumber); // Dùng để debug
    };

    /**
     * Xử lý logic đoán số
     */
    const checkGuess = () => {
        if (gameOver) return;

        // Logic Tư duy: Xử lý Input (Tránh lỗi)
        const guess = parseInt(guessInput.value);

        if (isNaN(guess) || guess < 1 || guess > 100) {
            resultText.textContent = 'Vui lòng nhập một số hợp lệ từ 1 đến 100!';
            resultText.className = 'message error';
            return;
        }

        attempts++;
        attemptsCount.textContent = `Số lần thử: ${attempts}`;

        if (guess === targetNumber) {
            resultText.textContent = `🎉 CHÚC MỪNG! Bạn đã đoán đúng số ${targetNumber} chỉ sau ${attempts} lần thử!`;
            resultText.className = 'message success';
            gameOver = true;
            guessInput.disabled = true;
            submitBtn.disabled = true;
            createConfetti(); // Kích hoạt Confetti
        } else if (guess < targetNumber) {
            resultText.textContent = 'Quá thấp! Hãy thử lại.';
            resultText.className = 'message low';
        } else {
            resultText.textContent = 'Quá cao! Hãy thử lại.';
            resultText.className = 'message high';
        }
        
        guessInput.value = ''; // Xóa input sau khi đoán
        guessInput.focus();
    };
    
    /**
     * Confetti Animation đơn giản bằng CSS
     */
    const createConfetti = () => {
        const colors = ['#f44336', '#FFEB3B', '#2196F3', '#4CAF50', '#9C27B0'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random vị trí và độ trễ để tạo hiệu ứng phân tán
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDelay = `${-Math.random() * 3}s`;
            confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5})`; // Kích thước ngẫu nhiên
            
            confettiContainer.appendChild(confetti);
        }
    };

    // Gắn Event Listeners
    submitBtn.addEventListener('click', checkGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });
    newGameBtn.addEventListener('click', initGame);

    // Bắt đầu game khi trang tải
    initGame();
    // --- Kết thúc Bài 3 ---
});