const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const currentTime = new Date().toLocaleString(); 
  console.log(`Server running on port ${PORT} - Current time: ${currentTime}`);
});

