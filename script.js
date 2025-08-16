class TravelPlanner {
    constructor() {
        this.trips = JSON.parse(localStorage.getItem('trips')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.displayTrips();
    }

    bindEvents() {
        const form = document.getElementById('tripForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const trip = {
            id: Date.now(),
            destination: document.getElementById('destination').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            budget: document.getElementById('budget').value,
            notes: document.getElementById('notes').value,
            createdAt: new Date().toISOString()
        };

        if (!this.validateTrip(trip)) {
            return;
        }

        this.addTrip(trip);
        this.clearForm();
        this.displayTrips();
    }

    validateTrip(trip) {
        if (!trip.destination.trim()) {
            alert('目的地を入力してください');
            return false;
        }

        if (!trip.startDate || !trip.endDate) {
            alert('開始日と終了日を入力してください');
            return false;
        }

        if (new Date(trip.startDate) > new Date(trip.endDate)) {
            alert('開始日は終了日より前である必要があります');
            return false;
        }

        return true;
    }

    addTrip(trip) {
        this.trips.push(trip);
        this.saveToStorage();
    }

    deleteTrip(id) {
        if (confirm('この旅行を削除しますか？')) {
            this.trips = this.trips.filter(trip => trip.id !== id);
            this.saveToStorage();
            this.displayTrips();
        }
    }

    saveToStorage() {
        localStorage.setItem('trips', JSON.stringify(this.trips));
    }

    clearForm() {
        document.getElementById('tripForm').reset();
    }

    displayTrips() {
        const container = document.getElementById('tripContainer');
        
        if (this.trips.length === 0) {
            container.innerHTML = '<p class="no-trips">まだ旅行が登録されていません</p>';
            return;
        }

        container.innerHTML = this.trips
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .map(trip => this.createTripCard(trip))
            .join('');

        this.bindDeleteEvents();
    }

    createTripCard(trip) {
        const startDate = new Date(trip.startDate).toLocaleDateString('ja-JP');
        const endDate = new Date(trip.endDate).toLocaleDateString('ja-JP');
        const budget = trip.budget ? `${parseInt(trip.budget).toLocaleString()}円` : '未設定';
        const daysUntil = this.getDaysUntil(trip.startDate);
        
        return `
            <div class="trip-card">
                <h3>${trip.destination}</h3>
                <div class="trip-details">
                    <div class="trip-detail">
                        <strong>開始日:</strong> ${startDate}
                    </div>
                    <div class="trip-detail">
                        <strong>終了日:</strong> ${endDate}
                    </div>
                    <div class="trip-detail">
                        <strong>予算:</strong> ${budget}
                    </div>
                    <div class="trip-detail">
                        <strong>あと:</strong> ${daysUntil}
                    </div>
                </div>
                ${trip.notes ? `<div class="trip-notes">${trip.notes}</div>` : ''}
                <button class="delete-btn" data-id="${trip.id}">削除</button>
            </div>
        `;
    }

    getDaysUntil(startDate) {
        const today = new Date();
        const tripDate = new Date(startDate);
        const diffTime = tripDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return '終了済み';
        } else if (diffDays === 0) {
            return '今日出発！';
        } else {
            return `${diffDays}日`;
        }
    }

    bindDeleteEvents() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteTrip(id);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TravelPlanner();
});