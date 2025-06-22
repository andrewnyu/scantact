# Scantact 📱📇

A simple and elegant React Native app for generating QR codes to share contact information. Create digital business cards that can be easily scanned and added to any smartphone's contacts.

## ✨ Features

- **Contact Information Management**: Add name and multiple phone numbers with customizable labels
- **QR Code Generation**: Generate vCard-compatible QR codes for instant contact sharing
- **Multiple Phone Numbers**: Support for multiple phone numbers with custom labels (Mobile, Work, Home, Other, or custom)
- **Additional Fields**: Optional fields for email, company, job title, website, address, and notes
- **Custom QR Display**: Customize QR code screen title and subtitle
- **Cross-Platform**: Works on Android, iOS, and Web
- **Modern UI**: Clean Material Design-inspired interface
- **Real-time Preview**: See QR code updates as you type

## 🎯 Use Cases

- **Business Networking**: Share contact info at meetings and conferences
- **Social Events**: Quick contact exchange without typing
- **Professional Settings**: Digital business cards for sales and networking
- **Personal Use**: Easy contact sharing with friends and family

## 📱 Screenshots

### Contact Form Screen
The main screen where users input their contact information with a clean, organized interface.

### QR Code Display Screen
A dedicated screen showing the generated QR code with customizable title and subtitle.

### Phone Label Selection
Modal interface for selecting or customizing phone number labels.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For Android development: Android Studio and Android SDK
- For iOS development: Xcode (macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scantact
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   
   # For Web
   npm run web
   ```

## 🛠️ Building for Production

### Android APK

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build APK**
   ```bash
   eas build --platform android --profile preview
   ```

### iOS IPA

1. **Build for iOS**
   ```bash
   eas build --platform ios --profile preview
   ```

## 📦 Dependencies

- **React Native**: Core framework
- **Expo**: Development platform and tools
- **react-native-qrcode-svg**: QR code generation
- **react-native-svg**: SVG support for QR codes
- **expo-contacts**: Contact management (for future features)

## 🎨 UI/UX Features

- **Material Design**: Clean, modern interface following Material Design principles
- **Responsive Layout**: Adapts to different screen sizes
- **Keyboard Handling**: Proper keyboard avoidance and scrolling
- **Form Validation**: Real-time validation with visual feedback
- **Accessibility**: Proper labels and touch targets

## 🔧 Technical Details

- **vCard Format**: Generates standard vCard 3.0 format for maximum compatibility
- **QR Code Standards**: Uses standard QR code format readable by all QR scanners
- **State Management**: React hooks for efficient state management
- **Performance**: Optimized rendering and minimal re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
- QR code generation powered by [react-native-qrcode-svg](https://github.com/react-native-svg/react-native-svg)
- Icons and design inspiration from Material Design

---

**Scantact** - Making contact sharing as simple as a scan! 📱✨ 