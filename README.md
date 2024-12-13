# 📚 Skar Book Reviews

## 📖 Project Overview

Skar Book Reviews is a web application that allows users to manage and track their book reviews. The application enables users to create, read, update, and delete book entries, with automatic book information retrieval and a visually appealing interface.

## ✨ Features

- **Book Entry Creation**: Add new books with ISBN, personal rating, and review notes
- **Automatic Book Information Retrieval**: Fetches book details (title, author) from Open Library API
- **Dynamic Book Cover Images**: Displays book covers using Open Library's cover API
- **Sorting Capabilities**: 
  - Sort books by rating
  - Sort books by recency
  - Sort books by title
- **Responsive Design**: Mobile-friendly layout with modern UI
- **CRUD Operations**: 
  - Create new book entries
  - Read existing book reviews
  - Update book reviews
  - Delete book entries

## 🛠 Tech Stack

- **Backend**: 
  - Node.js
  - Express.js
- **Database**: 
  - PostgreSQL
- **Frontend**: 
  - EJS (Templating Engine)
  - Bootstrap
  - Custom CSS
- **External APIs**: 
  - Open Library API

## 🚀 Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- npm (Node Package Manager)

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/skar-book-reviews.git
cd skar-book-reviews
```

2. Install dependencies
```bash
npm install
```

3. Database Setup
- Create a PostgreSQL database named `BookReview`
- Run the following SQL to create the books table:
```sql
CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    review TEXT,
    date DATE,
    ratings INTEGER
);
```

4. Configure Database Connection
- Update database credentials in `app.js`:
```javascript
const db = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "your_username",
    password: "your_password",
    database: "BookReview"
});
```

5. Start the Server
```bash
npm start
```

## 🌟 Usage

1. Home Page: View all book reviews
2. Create Button: Add a new book review
3. Sort Dropdown: Organize book reviews
4. Edit/Delete Buttons: Modify existing reviews

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop browsers
- Tablet devices
- Mobile phones

## 🎨 Design Notes

- Blurred glassmorphic design
- Book-themed background
- Hover effects on book review cards
- Customized scrollbar

## 🔒 Security Considerations

- Input validation
- Parameterized database queries
- Error handling for API calls

## 📝 Future Improvements

- User authentication
- Advanced search functionality
- Reading status tracking
- Export/import book reviews
- Improved UI design

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
