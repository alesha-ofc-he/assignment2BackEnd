const express = require('express');
const app = express();
const PORT = 3000;

app.use('/weather', weather);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});

