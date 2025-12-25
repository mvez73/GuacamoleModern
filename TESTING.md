# 🧪 Testing Apache Guacamole Modern Frontend with Docker

This guide will walk you through testing the application in a Docker environment, including verifying that the dark/light mode theme switching works correctly.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Docker** installed (v20.10 or higher)
- ✅ **Docker Compose** installed (v2.0 or higher)
- ✅ **Git** for cloning the repository
- ✅ **Modern web browser** (Chrome, Firefox, Safari, or Edge)

Check Docker installation:
```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start (Recommended)

### Option 1: Using the Test Script (Easiest)

```bash
# Navigate to project directory
cd /path/to/guacamole-modern-frontend

# Run the test script
./test-docker.sh
```

The script will automatically:
1. ✅ Build the Docker image
2. ✅ Check for existing containers
3. ✅ Start the container
4. ✅ Wait for it to be ready
5. ✅ Show container information

### Option 2: Using Docker Compose (Full Stack)

```bash
# Start all services (Frontend + Guacamole + MySQL)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 3: Using Docker Directly

```bash
# Build the image
docker build -t guacamole-modern-frontend:latest .

# Run the container
docker run -d \
  --name guacamole-modern-frontend \
  -p 3000:3000 \
  --restart unless-stopped \
  guacamole-modern-frontend:latest

# Verify it's running
docker ps
```

## 🎯 Accessing the Application

Once the container is running:

**URL**: http://localhost:3000

If you're using Docker Desktop or a remote server:
- Replace `localhost` with your server's IP or hostname
- Example: `http://192.168.1.100:3000`

## 🧪 Testing Dark/Light Mode

### Test Case 1: Theme Toggle from Header

**Steps:**
1. Open http://localhost:3000 in your browser
2. Locate the Sun/Moon icon in the top-right corner
3. Click the icon to open the theme dropdown
4. Select "Dark Mode"
5. **Expected**: The entire interface should switch to dark theme immediately

**Verification:**
- Background changes from white to dark gray
- Text color adjusts for contrast
- Card backgrounds become dark
- Border colors become subtle

### Test Case 2: Theme Toggle from Settings Page

**Steps:**
1. Navigate to "Settings" in the sidebar
2. Find the "Dark Mode" section
3. Click "Enable" or "Disable"
4. **Expected**: Theme should toggle immediately

### Test Case 3: Theme Persistence

**Steps:**
1. Switch to dark mode
2. Refresh the page (F5 or Cmd+R)
3. **Expected**: Dark mode should remain active
4. Close and reopen the browser
5. **Expected**: Dark mode should still be active

**Verification in DevTools:**
1. Right-click → "Inspect Element" (or F12)
2. Look at the `<html>` element
3. **Expected**: `class="dark"` when in dark mode, `class="light"` when in light mode

### Test Case 4: Light Mode Switch

**Steps:**
1. Make sure you're in dark mode
2. Click Sun icon or select "Light Mode"
3. **Expected**: Interface should switch back to light theme
4. Refresh to verify persistence

### Test Case 5: All Components

Check these components in both themes:

**Header:**
- [ ] Background color changes
- [ ] Text remains readable
- [ ] Search input styling updates
- [ ] Button hover states work

**Sidebar:**
- [ ] Background color changes
- [ ] Navigation items are visible
- [ ] Active/Inactive states are clear
- [ ] Folders and badges are readable

**Dashboard:**
- [ ] Stats cards adapt to theme
- [ ] Connection cards look good
- [ ] Status indicators are visible
- [ ] Icons contrast properly

**Connections Grid:**
- [ ] All cards maintain consistent styling
- [ ] Hover effects work in both themes
- [ ] Badges are readable

**Settings Page:**
- [ ] Cards adapt to theme
- [ ] Inputs are styled correctly
- [ ] Buttons have proper contrast
- [ ] Toggle switch visual state is clear

**Footer:**
- [ ] Background color adapts
- [ ] Text remains readable
- [ ] Links are visible

### Test Case 6: Real-time Theme Switching

**Steps:**
1. Open the application in two browser tabs/windows
2. Switch theme in one tab
3. **Expected**: The other tab should also update (they share localStorage)
4. Close one tab and switch theme
5. Reopen the tab
6. **Expected**: Should load with the correct theme

## 🔍 Troubleshooting

### Issue: Container won't start

```bash
# Check container logs
docker logs guacamole-modern-frontend

# Common issues:
# - Port 3000 already in use
# - Insufficient system resources
# - Permission denied

# Solution: Stop conflicting container
docker stop <container-name>
docker rm <container-name>

# Try again
./test-docker.sh
```

### Issue: Theme doesn't switch

**Steps:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check `<html>` element class attribute
4. Check Network tab for failed resource loads
5. Clear localStorage: `localStorage.clear()`
6. Refresh page

### Issue: Theme doesn't persist after refresh

**Check:**
```javascript
// In browser console, run:
console.log(localStorage.getItem('guacamole-theme'))
// Expected: 'light' or 'dark'
// If null: ThemeProvider not working correctly
```

**Fix:**
```bash
# Stop and remove container
docker stop guacamole-modern-frontend
docker rm guacamole-modern-frontend

# Rebuild image (ensure latest code)
docker build -t guacamole-modern-frontend:latest .

# Run again
docker run -d --name guacamole-modern-frontend -p 3000:3000 guacamole-modern-frontend:latest
```

### Issue: Can't access localhost:3000

**Possible Solutions:**

1. **Check if container is running:**
   ```bash
   docker ps
   ```
   Should show `guacamole-modern-frontend` in the list

2. **Check if port is exposed:**
   ```bash
   docker port guacamole-modern-frontend
   ```
   Should show `3000/tcp -> 0.0.0.0:3000`

3. **If using Docker Desktop on Windows/Mac:**
   - Try `http://localhost:3000`
   - Or check Docker Desktop IP: usually `http://127.0.0.1:3000`

4. **If using Linux:**
   - Check firewall: `sudo ufw status`
   - Allow port if needed: `sudo ufw allow 3000`

5. **If using Docker Machine:**
   - Get Docker Machine IP: `docker-machine ip default`
   - Use that IP instead of localhost

## 📊 Performance Testing

### Test Page Load Time

```bash
# Measure build time
time docker build -t guacamole-modern-frontend:latest .

# Measure container start time
time docker run -d guacamole-modern-frontend:latest

# In browser, check Network tab:
# - First Contentful Paint (FCP)
# - Largest Contentful Paint (LCP)
# - Time to Interactive (TTI)
```

### Test Memory Usage

```bash
# Check container resource usage
docker stats guacamole-modern-frontend

# Good ranges:
# - Memory: 50-150MB
# - CPU: < 5% idle
```

## 🧪 Testing Checklist

Use this checklist to verify all functionality:

### Theme Functionality
- [ ] Light mode works correctly
- [ ] Dark mode works correctly
- [ ] Theme toggle from header works
- [ ] Theme toggle from settings works
- [ ] Theme persists after page refresh
- [ ] Theme persists after browser restart
- [ ] All components respond to theme change
- [ ] No layout shifts when switching themes

### UI/UX
- [ ] Dashboard loads without errors
- [ ] Connection cards display correctly
- [ ] Sidebar navigation works
- [ ] Search filters connections
- [ ] Dialogs open and close properly
- [ ] Responsive design works on mobile
- [ ] Hover effects are smooth

### Dark Mode Specific
- [ ] Background is dark (not black)
- [ ] Text has proper contrast
- [ ] Cards have subtle borders
- [ ] Icons are visible
- [ ] Badges are readable
- [ ] Input fields are styled correctly
- [ ] Buttons have proper hover states

### Light Mode Specific
- [ ] Background is white/light
- [ ] Text is dark enough
- [ ] Cards have clear separation
- [ ] Borders are subtle but visible
- [ ] Shadows are appropriate
- [ ] All elements are legible

## 🚀 Production Deployment Testing

If everything works in local Docker, test production deployment:

```bash
# 1. Tag for Docker Hub
docker tag guacamole-modern-frontend:latest your-username/guacamole-modern-frontend:latest

# 2. Login to Docker Hub
docker login

# 3. Push to Docker Hub
docker push your-username/guacamole-modern-frontend:latest

# 4. Test pull from Docker Hub
docker run -d -p 3000:3000 your-username/guacamole-modern-frontend:latest
```

## 📝 Expected Results

When you run the tests, you should experience:

✅ **Instant Theme Switching** - Theme changes immediately when toggled
✅ **Perfect Persistence** - Theme remembers your choice across sessions
✅ **Smooth Transitions** - No jarring visual changes
✅ **Complete Coverage** - Every UI element adapts to the theme
✅ **Accessibility** - Text remains readable in both themes
✅ **Consistent Styling** - All cards, buttons, and inputs match the theme

## 🐛 Reporting Issues

If you find any issues during testing:

1. **Document the issue:**
   - What you did
   - What happened (actual result)
   - What you expected to happen
   - Browser name and version
   - OS and version

2. **Gather information:**
   ```bash
   # Container logs
   docker logs guacamole-modern-frontend

   # Container info
   docker inspect guacamole-modern-frontend

   # Resource usage
   docker stats guacamole-modern-frontend
   ```

3. **Report:**
   - Create an issue on GitHub
   - Include logs and screenshots
   - Provide browser and environment details

## 🎉 Success Criteria

Testing is successful when:

- ✅ Application starts without errors
- ✅ Theme toggles between light and dark modes
- ✅ Theme persists after refresh
- ✅ All UI components adapt correctly
- ✅ No console errors
- ✅ Performance is acceptable (load < 3s)
- ✅ Works on multiple browsers
- ✅ Mobile responsive design works

---

**Happy Testing! 🧪**
