// 播放器状态
let isPlaying = false;
let currentSong = null;
let audioPlayer = document.getElementById('audioPlayer');
let progressInterval = null;

// DOM元素
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const playerSongName = document.querySelector('.player-song-name');
const playerSongArtist = document.querySelector('.player-song-artist');
const playerCover = document.querySelector('.player-cover img');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');

// 在线歌曲数据（使用免费音乐资源）
// 注意：这些是示例音频链接，实际使用时请替换为合法的音频资源
const songs = [
    { 
        id: 1, 
        name: '无人之境', 
        artist: '陈奕迅', 
        duration: '04:45', 
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
        url: 'https://er-sycdn.kuwo.cn/4aee2f5b826de7ed0d3afb6bd96701fb/694e4e67/resource/30106/trackmedia/M500001iK7BP0UUR6L.mp3'
    },
    { 
        id: 2, 
        name: 'Jazz Night', 
        artist: 'Smooth Jazz', 
        duration: '04:12', 
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    { 
        id: 3, 
        name: 'Acoustic Dreams', 
        artist: 'Acoustic Guitar', 
        duration: '03:28', 
        cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf29a8e?w=200&h=200&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    { 
        id: 4, 
        name: 'Piano Melody', 
        artist: 'Classical Piano', 
        duration: '04:05', 
        cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=200&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    { 
        id: 5, 
        name: 'Electronic Vibes', 
        artist: 'EDM Mix', 
        duration: '03:52', 
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
];

// 音频播放器事件监听
audioPlayer.addEventListener('loadedmetadata', function() {
    updateTotalTime();
});

audioPlayer.addEventListener('timeupdate', function() {
    updateProgress();
});

audioPlayer.addEventListener('ended', function() {
    // 播放结束后自动播放下一首
    if (currentSong) {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const nextIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
        playSong(songs[nextIndex]);
    }
});

audioPlayer.addEventListener('error', function(e) {
    console.error('音频加载错误:', e);
    alert('音频加载失败，请检查网络连接或稍后重试');
});

// 播放/暂停功能
playPauseBtn.addEventListener('click', function() {
    if (!currentSong) {
        // 如果没有当前歌曲，播放第一首
        playSong(songs[0]);
    } else {
        togglePlayPause();
    }
});

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.textContent = '▶';
    } else {
        audioPlayer.play().catch(function(error) {
            console.error('播放失败:', error);
            alert('播放失败，请检查音频文件');
        });
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
    }
}

function playSong(song) {
    currentSong = song;
    
    // 更新播放器信息
    playerSongName.textContent = song.name;
    playerSongArtist.textContent = song.artist;
    playerCover.src = song.cover;
    
    // 设置音频源
    audioPlayer.src = song.url;
    audioPlayer.load();
    
    // 播放音频
    audioPlayer.play().then(() => {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
    }).catch(function(error) {
        console.error('播放失败:', error);
        // 如果播放失败，提示用户
        if (error.name === 'NotAllowedError') {
            alert('请点击页面任意位置以允许音频播放');
        } else {
            alert('音频加载中，请稍候...\n如果长时间无法播放，可能是音频链接不可用');
        }
    });
}

function updateProgress() {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percentage + '%';
        
        // 更新时间显示
        const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
        const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
        const totalMinutes = Math.floor(audioPlayer.duration / 60);
        const totalSeconds = Math.floor(audioPlayer.duration % 60);
        
        document.querySelector('.current-time').textContent = 
            `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;
        document.querySelector('.total-time').textContent = 
            `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    }
}

function updateTotalTime() {
    if (audioPlayer.duration) {
        const totalMinutes = Math.floor(audioPlayer.duration / 60);
        const totalSeconds = Math.floor(audioPlayer.duration % 60);
        document.querySelector('.total-time').textContent = 
            `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    }
}

// 上一首/下一首
prevBtn.addEventListener('click', function() {
    if (currentSong) {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
        playSong(songs[prevIndex]);
    }
});

nextBtn.addEventListener('click', function() {
    if (currentSong) {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const nextIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
        playSong(songs[nextIndex]);
    } else {
        playSong(songs[0]);
    }
});

// 点击歌曲列表播放
document.querySelectorAll('.song-item').forEach((item, index) => {
    item.addEventListener('click', function() {
        playSong(songs[index]);
    });
});

// 点击歌单卡片
document.querySelectorAll('.playlist-card').forEach((card, index) => {
    card.addEventListener('click', function() {
        // 播放歌单第一首歌
        playSong(songs[0]);
    });
});

// 点击播放按钮（歌曲列表中的）
document.querySelectorAll('.song-play-btn').forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        playSong(songs[index]);
    });
});

// 导航菜单切换
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// 搜索功能
searchBtn.addEventListener('click', function() {
    const keyword = searchInput.value.trim();
    if (keyword) {
        // 简单的搜索功能（演示）
        const results = songs.filter(song => 
            song.name.toLowerCase().includes(keyword.toLowerCase()) || 
            song.artist.toLowerCase().includes(keyword.toLowerCase())
        );
        if (results.length > 0) {
            alert(`找到 ${results.length} 首相关歌曲：\n${results.map(s => s.name).join('\n')}`);
        } else {
            alert('未找到相关歌曲');
        }
    }
});

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// 进度条点击
document.querySelector('.progress-bar').addEventListener('click', function(e) {
    if (audioPlayer.duration) {
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        audioPlayer.currentTime = audioPlayer.duration * percentage;
        updateProgress();
    }
});

// 音量控制
let volume = 0.7;
audioPlayer.volume = volume;

document.querySelector('.volume-bar').addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    volume = Math.max(0, Math.min(1, clickX / rect.width));
    audioPlayer.volume = volume;
    document.querySelector('.volume-fill').style.width = (volume * 100) + '%';
});

// 初始化
updateProgress();
