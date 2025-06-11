const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// In-memory database (from your api-server.cjs)
let database = {
  users: [
    { id: 1, name: 'રાહુલ પટેલ', email: 'rahul@example.com', password: 'password123', role: 'Student', status: 'Active', joinDate: '15 જાન, 2025', downloads: 45 },
    { id: 2, name: 'પ્રિયા શાહ', email: 'priya@example.com', password: 'password123', role: 'Teacher', status: 'Active', joinDate: '12 જાન, 2025', downloads: 78 },
    { id: 3, name: 'અમિત જોશી', email: 'amit@example.com', password: 'password123', role: 'Student', status: 'Inactive', joinDate: '10 જાન, 2025', downloads: 23 },
    { id: 4, name: 'સુનીતા દેસાઈ', email: 'sunita@example.com', password: 'admin123', role: 'Admin', status: 'Active', joinDate: '8 જાન, 2025', downloads: 156 },
  ],
  materials: [
    { id: 1, title: 'GPSC વર્ગ 1-2 સામાન્ય અભ્યાસ સંપૂર્ણ નોટ્સ', category: 'GPSC', type: 'PDF', size: '25 MB', downloads: 15420, views: 45230, rating: 4.8, status: 'Published', uploadDate: '10 જાન, 2025' },
    { id: 2, title: 'ગુજરાતી વ્યાકરણ માસ્ટર કોર્સ વિડિયો', category: 'ગુજરાતી', type: 'Video', size: '2.5 કલાક', downloads: 8950, views: 28340, rating: 4.9, status: 'Published', uploadDate: '8 જાન, 2025' },
  ],
  jobs: [
    { id: 1, title: 'GPSC વર્ગ 1-2 મુખ્ય પરીક્ષા 2025', company: 'ગુજરાત લોક સેવા આયોગ', location: 'ગાંધીનગર', type: 'સરકારી', salary: '₹47,600 - ₹1,51,100', vacancy: '350 જગ્યાઓ', deadline: '15 ફેબ્રુઆરી, 2025', applicants: 25000, status: 'Active', postDate: '1 જાન, 2025' },
  ],
  videos: [
    { id: 1, title: 'બંધારણ - આમુખ અને તેના મહત્વના પ્રશ્નો', description: 'ભારતીય બંધારણના આમુખ વિશે વિગતવાર ચર્ચા અને પરીક્ષાલક્ષી પ્રશ્નો.', thumbnailUrl: 'https://img.youtube.com/vi/5g0_g_N3EaM/hqdefault.jpg', videoId: '5g0_g_N3EaM', category: 'બંધારણ', duration: '45:12' },
  ],
  chatMessages: [],
  stats: { totalMaterials: 24567, totalUsers: 345890, todayDownloads: 2340, totalJobs: 12450 }
};

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// --- API ROUTES ---
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password.' });
    }
    if (database.users.find(u => u.email === email)) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }
    const newUser = { id: Date.now(), name, email, password, role: 'Student', status: 'Active', joinDate: new Date().toLocaleDateString('gu-IN'), downloads: 0 };
    database.users.push(newUser);
    database.stats.totalUsers++;
    return res.status(201).json({ success: true, message: 'User registered successfully.' });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = database.users.find(u => u.email === email && u.password === password);
    if (user) {
      const token = `fake-token-${Date.now()}`;
      return res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
});

app.get('/api/materials', (req, res) => res.json(database.materials));
app.get('/api/videos', (req, res) => res.json(database.videos));
app.get('/api/jobs', (req, res) => res.json(database.jobs));
app.get('/api/stats', (req, res) => res.json(database.stats));

// --- STATIC FILE SERVING ---
// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'working-app.html'));
});

// Route for the admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(port, () => {
  console.log(`🚀 DK with Study server running at http://localhost:${port}/`);
  console.log('Magic is happening... server is ready for the internet!');
});
