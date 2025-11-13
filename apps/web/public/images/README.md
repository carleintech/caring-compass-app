# 📸 Image Directory Guide for Caring Compass App

## 📁 Directory Structure

```
public/images/
├── logos/           # Company logos and brand assets
├── team/           # Leadership team photos
├── services/       # Service-related images
├── hero/           # Hero section images
├── about/          # About page images
└── README.md       # This guide
```

## 🎯 Where to Place Your Images

### 1. **Company Logos** → `public/images/logos/`
Place your logo files here:
- `caring-compass-logo.png` (Main logo)
- `caring-compass-logo-white.png` (White version)
- `caring-compass-icon.png` (Icon only)
- `caring-compass-favicon.ico` (Favicon)

**Usage in code:**
```tsx
<Image src="/images/logos/caring-compass-logo.png" alt="Caring Compass" width={200} height={60} />
```

### 2. **Team Photos** → `public/images/team/`
Place leadership team photos here:
- `erickharlein-pierre.jpg` (CEO)
- `jean-pierre.jpg` (COO)
- `jacques-geralbert.jpg` (CFO)
- `emmanuela-nicolas.jpg` (CMO)
- `mitchela-begin.jpg` (CHRO)
- `denise-colas.jpg` (Director of Client Services)

**Current placeholder locations in code:**
- About page: `/api/placeholder/150/150` → Replace with `/images/team/filename.jpg`

**Usage in code:**
```tsx
<Image src="/images/team/erickharlein-pierre.jpg" alt="Erickharlein Pierre" width={150} height={150} />
```

### 3. **Service Images** → `public/images/services/`
Place service-related photos here:
- `personal-care.jpg` (Personal care services)
- `companionship.jpg` (Companionship services)
- `home-care.jpg` (General home care)
- `caregiver-assistance.jpg` (Caregiver helping senior)

### 4. **Hero Images** → `public/images/hero/`
Place large hero section images here:
- `hero-main.jpg` (Main hero image)
- `hero-about.jpg` (About page hero)
- `hero-services.jpg` (Services page hero)

### 5. **About Page Images** → `public/images/about/`
Place about page specific images here:
- `our-story.jpg` (Our story section)
- `grandmother-home.jpg` (Story illustration)
- `caring-at-home.jpg` (Home care illustration)

**Current placeholder locations in code:**
- About page story: `/api/placeholder/600/500` → Replace with `/images/about/our-story.jpg`
- About page care: `/api/placeholder/500/400` → Replace with `/images/about/caring-at-home.jpg`

## 🔧 How to Update Images in Code

### Current Placeholders to Replace:

1. **About Page Story Image:**
```tsx
// Current:
<Image src="/api/placeholder/600/500" alt="Caring for seniors at home" />

// Replace with:
<Image src="/images/about/our-story.jpg" alt="Caring for seniors at home" />
```

2. **Team Member Photos:**
```tsx
// Current:
<Image src="/api/placeholder/150/150" alt={member.name} />

// Replace with:
<Image src={`/images/team/${member.photo}`} alt={member.name} />
```

## 📐 Recommended Image Specifications

### **Logos:**
- **Main Logo:** 400x120px (PNG with transparent background)
- **Icon:** 64x64px (PNG/SVG)
- **Favicon:** 32x32px (ICO format)

### **Team Photos:**
- **Size:** 400x400px minimum
- **Format:** JPG or PNG
- **Quality:** High resolution, professional headshots
- **Background:** Consistent (white/neutral preferred)

### **Service Images:**
- **Size:** 800x600px
- **Format:** JPG or WebP
- **Quality:** High quality, professional photography
- **Content:** Relevant to each service

### **Hero Images:**
- **Size:** 1920x1080px (Full HD)
- **Format:** JPG or WebP
- **Quality:** High resolution
- **Content:** Inspiring, relevant to home care

## 🚀 After Adding Images

1. **Restart your development server** after adding new images
2. **Update the image paths** in your components
3. **Test the images** in your browser
4. **Optimize images** for web (consider using WebP format for better performance)

## 💡 Tips

- Use descriptive filenames (e.g., `erickharlein-pierre-ceo.jpg`)
- Keep file sizes reasonable (< 500KB for photos, < 100KB for logos)
- Use consistent naming conventions
- Consider using WebP format for better performance
- Always include meaningful alt text for accessibility

## 🔄 Current Files Using Placeholders

### About Page (`src/app/about/page.tsx`):
- Line ~200: Team member images (`/api/placeholder/150/150`)
- Line ~170: Story section image (`/api/placeholder/600/500`)

### Other Pages:
- Check for other `/api/placeholder/` references that need real images

---

**Need help updating the code after adding images? Let me know and I'll help you replace the placeholder URLs with your real image paths!**
