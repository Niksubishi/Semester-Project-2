# **YoBid (Online Auction House) - Nikolas Bishop**  
<img width="1339" alt="Screenshot 2025-03-02 at 18 28 45" src="https://github.com/user-attachments/assets/72bffa2f-e8ae-4a3c-91e6-13bd88531ced" />


### **Table of Contents 📚**
1. [Project Overview](#project-overview-🌍)
2. [Key Features](#key-features-✨)
3. [Installation](#installation-⚙️)
4. [Development](#development-🛠️)
5. [Performance & UX](#performance--ux-⚡)
6. [Tech Stack](#tech-stack-💻)   

---

## **Project Overview 🌍**  
This project is an online auction platform where users can bid on various items, from electronics to collectibles. The website allows users to create listings, place bids, and manage their auction history. This project is developed using Vite, Tailwind CSS, and JavaScript, and emphasizes a seamless and intuitive user experience.
The project was developed by [**Nikolas Bishop**](https://github.com/Niksubishi).

[Link to live site](https://yobid.netlify.app/)💻

---

## **Key Features ✨**  
1. **User Authentication**:  
   - Users can **register** and **log in** using email and password.  
   - JWT-based authentication ensures secure access to user-specific actions.  

2. **Post Management**:  
   - Users can create, edit, and delete item listings.
   - Listings display detailed information such as title, description, starting bid, and images. 

3. **Bidding System**:  
   - Users can place bids on available items.  
   - Bidding updates are reflected in real-time. 

4. **User Profiles**:  
   - Users can view and manage their profiles, including their active bids and listings.

5. **Search and Filter**:
   - Search for listings or filter them by tags to find specific content easily.
   - Sort listings by newest, oldest, ending soon, or ending last.

6. **PWA Features**:
   - Progressive Web App functionality with service worker.
   - Offline support and app-like experience.
   - Installable on mobile and desktop devices.

7. **Responsive Design**:
   - Fully responsive design that adapts to all screen sizes using Tailwind CSS.
   - Mobile-first approach with optimized touch interactions. 

---

## **Installation ⚙️**
### Steps to Set Up the Project Locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/Niksubishi/Semester-Project-2.git
   cd Semester-Project-2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to port shown in terminal.

---

## **Development 🛠️**
### Available Commands:
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Check code quality with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Project Structure:
```
src/
├── js/
│   ├── api/          # API integration modules
│   ├── constants/    # App constants and configuration
│   ├── ui/           # UI components and handlers
│   ├── utils/        # Utility functions and helpers
│   ├── views/        # Page-specific logic
│   └── main.js       # Application entry point
├── assets/           # Static assets (images, etc.)
├── pages/            # HTML page templates
└── style.css         # Global styles
```

---

## **Performance & UX ⚡**
### Enhanced User Experience:
- **Automatic Retry Logic**: Failed API requests are automatically retried up to 3 times with exponential backoff
- **Skeleton Loading States**: Users see loading placeholders instead of blank screens during data fetching
- **Intelligent Caching**: API responses are cached for improved performance and reduced server load
- **Error Recovery**: User-friendly error messages with retry buttons when operations fail
- **Optimized Images**: Image optimization and lazy loading for faster page loads
- **Request Deduplication**: Prevents duplicate API calls for improved efficiency

### Accessibility Features:
- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard accessibility throughout the application
- **Focus Management**: Proper focus handling for modals and interactive elements
- **Semantic HTML**: Semantic markup for better accessibility and SEO

---

## **Tech Stack 💻**

### **Frontend Technologies:**
* **HTML5**: Semantic markup with modern web standards
* **CSS3 & Tailwind CSS**: Utility-first responsive styling framework
* **JavaScript (ES6+)**: Modern JavaScript with modules and async/await
* **Progressive Web App**: Service worker implementation for offline functionality

### **Development Tools:**
* **Vite**: Fast build tool and development server with hot module replacement
* **Vitest**: Unit testing framework with coverage reporting
* **ESLint**: Code quality and consistency checking
* **Prettier**: Automatic code formatting

### **API & Data Management:**
* **Noroff Auction API**: RESTful API for auction, user, and bidding operations
* **JWT Authentication**: Secure token-based authentication system
* **LocalStorage**: Client-side data persistence for user sessions
* **Fetch API**: Native HTTP client with retry logic and caching

### **Performance & UX:**
* **Custom Loading States**: Skeleton loading and progress indicators
* **Error Handling**: Comprehensive error recovery with user-friendly messages
* **Image Optimization**: Lazy loading and responsive image handling
* **Request Caching**: Intelligent API response caching system

### **Deployment & Hosting:**
* **Netlify**: Continuous deployment and hosting platform
* **Git**: Version control with GitHub integration

---
