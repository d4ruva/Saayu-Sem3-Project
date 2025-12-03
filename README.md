# SmartChoice - Mobile Phone Comparison Platform

A full-stack web application built with Django (backend) and React (frontend) for browsing, comparing, and managing your favorite mobile phones.

## Features

### 🔍 **Phone Catalog**
- Browse all phones in an interactive grid layout
- **Search** by brand or model name with real-time filtering
- **Filter by brand** with dynamic brand selection
- **Sort** by RAM, Battery capacity, or Price
- **Order** results in ascending or descending order
- **Pagination** with 12 items per page
- **Like/Favorite** phones (requires login)

### ⚡ **Live Price Search**
- Real-time mobile phone prices from Google Shopping via SERPAPI
- Batch search multiple phones simultaneously
- Product images and pricing from live sources

### 🔄 **Phone Comparison**
- Side-by-side comparison of two phones
- Detailed specifications
- Live pricing information

### 💡 **Smart Preferences**
- Get recommended phones based on preferences:
  - **Gaming**: High RAM devices
  - **Battery Life**: Long-lasting batteries
  - **Photography**: Latest camera models
  - **Performance**: High-end processors
- Curated 12-phone recommendations per category

### ❤️ **Favorites Management**
- Save your favorite phones
- View all liked phones in one place
- Token-based authentication
- Persistent favorites per user

### 🔐 **User Authentication**
- Simple token-based login system
- Username/password authentication
- Persistent login with localStorage
- Logout functionality

## Tech Stack

### Backend
- **Framework**: Django 5.0 with Django REST Framework
- **Database**: SQLite (db.sqlite3)
- **External APIs**: SERPAPI (Google Shopping search), Google Custom Search API
- **Python Packages**:
  - `djangorestframework`: REST API
  - `django-cors-headers`: CORS support
  - `requests`: HTTP requests
  - `python-dotenv`: Environment variables

### Frontend
- **Framework**: React 19.2.0
- **HTTP Client**: Axios with retry logic
- **UI Components**: React-Bootstrap 2.10.10, Bootstrap 5.3.8
- **Build Tool**: Create React App
- **State Management**: React Hooks (useState, useEffect)

### Data Source
- CSV dataset: `mobiles_clean.csv` (~1000+ phones)
- Brands: Apple, Samsung, OnePlus, Xiaomi, Google Pixel, and more

## Project Structure

```
Smartchjoice/
├── api/                          # Django app
│   ├── views.py                  # API endpoints
│   ├── urls.py                   # URL routing
│   ├── models.py                 # Mobile model
│   ├── serializers.py            # Serializers
│   ├── migrations/               # Database migrations
│   └── ...
├── smartchoice/                  # Django project settings
│   ├── settings.py               # Configuration
│   ├── urls.py                   # Project URLs
│   └── ...
├── frontend/                     # React application
│   ├── src/
│   │   ├── App.js                # Main app with view routing
│   │   ├── api.js                # API client
│   │   ├── Components/
│   │   │   ├── Catalog.js        # Phone grid with filters
│   │   │   ├── Compare.js        # Phone comparison
│   │   │   ├── Preferences.js    # Recommendations
│   │   │   ├── Favorites.js      # Liked phones
│   │   │   ├── Navbar.js         # Navigation
│   │   │   └── Login.js          # Login modal
│   │   └── ...
│   └── package.json
├── manage.py                     # Django management
├── db.sqlite3                    # Database
├── mobiles_clean.csv             # Phone data
└── requirements.txt              # Python dependencies
```

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- pip
- npm

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/d4ruva/Saayu-Sem3-Project.git
   cd Smartchjoice
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root:
   ```
   SERPAPI_KEY=your_serpapi_key_here
   GOOGLE_SEARCH_KEY=your_google_api_key
   DEBUG=True
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Load phone data**
   ```bash
   python manage.py shell
   # Then in shell:
   from api.models import Mobile
   import csv
   with open('mobiles_clean.csv') as f:
       reader = csv.DictReader(f)
       for row in reader:
           Mobile.objects.create(**row)
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start Django server**
   ```bash
   python manage.py runserver
   ```
   Server runs at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start React development server**
   ```bash
   npm start
   ```
   App runs at `http://localhost:3000`

## API Endpoints

All endpoints are prefixed with `/api/`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/mobiles/` | List all phones | No |
| GET | `/mobiles/?brand=Apple&sort=ram&order=desc` | List with filters | No |
| GET | `/live/?q=iPhone 16` | Live price search | No |
| POST | `/live_batch/` | Batch live search | No |
| GET | `/compare/?m1=iPhone 16&m2=Samsung S24` | Compare two phones | No |
| GET | `/preferences/?type=gaming` | Get recommendations | No |
| POST | `/login/` | User login | No |
| GET | `/me/` | Get current user | Yes |
| POST | `/toggle_like/` | Like/unlike phone | Yes |
| GET | `/favorites/` | Get liked phones | Yes |

### Authentication

Include Bearer token in headers:
```
Authorization: Bearer <token>
```

## Usage

### 1. Browse Phones
- Navigate to **Catalog** tab
- Use search bar to find phones
- Filter by brand, sort by specs
- Click hearts to like phones (login required)

### 2. Search Phones
- Use the search box at the top of Catalog
- Search works for both brand and model names
- Click ✕ button to clear search

### 3. Compare Phones
- Go to **Compare** tab
- Select two phones from dropdowns
- View side-by-side specifications and live prices

### 4. Get Recommendations
- Click **Preferences** tab
- Choose preference type (Gaming, Battery, Photography, Performance)
- Browse recommended phones sorted by relevance

### 5. Manage Favorites
- Like phones in Catalog or Preferences (login required)
- View all favorites in **Favorites** tab
- Remove phones with delete button

### 6. Login/Logout
- Click **Login** button in navbar
- Enter credentials
- Token is stored in localStorage
- Click **Logout** to clear

## Configuration

### SERPAPI Integration
The app uses SERPAPI for live phone searches. To enable:

1. Get API key from [serpapi.com](https://serpapi.com)
2. Add to `.env`:
   ```
   SERPAPI_KEY=your_key_here
   ```

### Customize Preferences Logic
Edit `/api/views.py` `api_preferences()` function to change recommendation criteria.

### Adjust Pagination
Change `PAGE_SIZE = 12` in `frontend/src/Components/Catalog.js`

## Performance Optimizations

- Axios retry logic (2-3 attempts on failure)
- 20-second request timeout
- Inline SVG placeholders (no server requests for images)
- Batch API for multiple searches
- React lazy loading & pagination
- ThreadPoolExecutor for concurrent live searches

## Troubleshooting

### "Module not found: Error: Can't resolve 'axios'"
```bash
cd frontend
npm install axios
```

### SERPAPI Rate Limiting
- API has rate limits; batch searches may fail if exceeded
- Implement caching or reduce request frequency
- Check SERPAPI dashboard for usage

### Database Errors
```bash
python manage.py migrate
```

### CORS Issues
Ensure `django-cors-headers` is installed and configured in `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

## Future Enhancements

- [ ] User registration
- [ ] Persistent database for favorites
- [ ] Phone reviews and ratings
- [ ] Advanced filters (price range, camera MP, RAM)
- [ ] Wishlist sharing
- [ ] Mobile app version
- [ ] AI-powered recommendations
- [ ] Real-time price alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or issues, open a GitHub issue or contact the maintainers.

---

**Built with ❤️ by the SmartChoice Team**
