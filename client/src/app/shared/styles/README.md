# SkiNet Design System & Theme Guide

## 🎨 **Design Principles**

- **Sophisticated & Mature**: Appeals to adult customers with premium taste
- **Minimalist**: Clean, uncluttered design inspired by Apple/Tesla
- **Professional**: High-end e-commerce aesthetic
- **Consistent**: Unified visual language across all pages

## 🎯 **Visual Identity**

### **Color Strategy**

- **Primary**: Deep grays and slates for sophistication
- **Accent**: Subtle blues for tech/premium feel
- **Backgrounds**: Gradient shifts between dark tones
- **Text**: High contrast white on dark, dark on light

### **Typography Hierarchy**

- **Display**: Ultra-light (100-200 weight) for hero sections
- **Headings**: Semi-bold (600 weight) for content sections
- **Body**: Light-to-regular (300-400 weight) for readability
- **Labels**: Medium (500 weight) uppercase for categories

### **Spacing & Layout**

- **Generous whitespace**: Premium feel with room to breathe
- **Grid-based**: 8px grid system for consistency
- **Responsive**: Mobile-first approach with fluid scaling

## 🔧 **Implementation Guide**

### **Import the Theme**

```scss
@import "../shared/styles/theme.scss";
```

### **Use Mixins for Consistency**

```scss
// Hero sections
.hero {
  @include sophisticated-background("dark");

  &__content {
    @extend .hero-section__content;
  }
}

// Product cards
.product-card {
  @include premium-card;
}

// Buttons
.btn-primary {
  @include button-primary;
}

.btn-secondary {
  @include button-secondary;
}

// Icons
.icon-container {
  @include icon-container(3rem, "dark");
}
```

### **Typography Classes**

```html
<!-- Hero titles -->
<h1 class="typography-display-xl">Main Heading</h1>

<!-- Section headings -->
<h2 class="typography-heading-lg">Section Title</h2>

<!-- Body text -->
<p class="typography-body-md">Content text</p>

<!-- Labels -->
<span class="typography-label">Category</span>
```

### **Animation Classes**

```html
<!-- Fade in animations -->
<div class="animate-fade-in-up animation-delay-200">
  <!-- Content -->
</div>
```

## 🎪 **Component Templates**

### **Hero Section Structure**

```html
<div class="hero-section">
  <div class="hero-section__background"></div>
  <div class="hero-section__content">
    <span class="hero-section__badge">Premium Products</span>
    <h1 class="hero-section__title">Page Title</h1>
    <p class="hero-section__subtitle">Descriptive text</p>
    <div class="hero-section__buttons">
      <button class="btn-primary">Primary Action</button>
      <button class="btn-secondary">Secondary Action</button>
    </div>
  </div>
</div>
```

### **Product Grid Structure**

```html
<div class="product-grid">
  <div class="product-grid__item">
    <img class="product-grid__image" src="..." alt="..." />
    <h3 class="product-grid__title">Product Name</h3>
    <p class="product-grid__price">$99.99</p>
  </div>
</div>
```

### **Feature Cards Structure**

```html
<div class="feature-cards">
  <div class="feature-cards__card">
    <div class="feature-cards__icon">
      <svg>...</svg>
    </div>
    <h3 class="feature-cards__title">Feature Title</h3>
    <p class="feature-cards__description">Feature description</p>
  </div>
</div>
```

## 📱 **Responsive Guidelines**

### **Breakpoints**

- **sm**: 640px (mobile landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (laptop)
- **xl**: 1280px (desktop)
- **2xl**: 1536px (large desktop)

### **Usage**

```scss
.component {
  // Mobile first
  padding: 1rem;

  @include respond-to("md") {
    padding: 2rem;
  }

  @include respond-to("lg") {
    padding: 3rem;
  }
}
```

## 🚀 **Next Steps for Shop Page**

1. **Import theme**: `@import '../shared/styles/theme.scss';`
2. **Apply hero section**: Use `hero-section` classes
3. **Product grid**: Use `product-grid` structure
4. **Filters sidebar**: Apply `premium-card` mixin
5. **Navigation**: Use consistent typography and spacing
6. **Maintain color palette**: Stick to defined CSS variables

This theme will ensure the shop page has the same sophisticated, professional aesthetic as the home page!
