// Ensure you are using the correct database
use('plp_bookstore');

// ==========================================
// TASK 2: BASIC CRUD OPERATIONS
// ==========================================

// 1. Find all books in a specific genre (e.g., 'Fiction')
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year (e.g., 1950)
db.books.find({ published_year: { $gt: 1950 } });

// 3. Find books by a specific author
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 16.99 } }
);

// 5. Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" });


// ==========================================
// TASK 3: ADVANCED QUERIES
// ==========================================

// 1. Find books that are both in stock and published after 2010
// (Note: Based on your insert script, this may return an empty set unless you add newer books)
db.books.find({ 
  in_stock: true, 
  published_year: { $gt: 2010 } 
});

// 2. Use projection to return only the title, author, and price fields
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// 3. Sorting books by price - Ascending
db.books.find().sort({ price: 1 });

// 4. Sorting books by price - Descending
db.books.find().sort({ price: -1 });

// 5. Pagination: Page 1 (Limit 5)
db.books.find().limit(5);

// 6. Pagination: Page 2 (Skip 5, Limit 5)
db.books.find().skip(5).limit(5);


// ==========================================
// TASK 4: AGGREGATION PIPELINE
// ==========================================

// 1. Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
]);

// 2. Find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);


// ==========================================
// TASK 5: INDEXING
// ==========================================

// 1. Create an index on the 'title' field
db.books.createIndex({ title: 1 });

// 2. Create a compound index on 'author' and 'published_year'
db.books.createIndex({ author: 1, published_year: 1 });

// 3. Demonstrate performance improvement using explain()
// Compare this results with a non-indexed field search to see the speed difference
db.books.find({ title: "1984" }).explain("executionStats");