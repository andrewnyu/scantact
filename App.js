import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [showQR, setShowQR] = useState(false);

  const generateVCard = () => {
    let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
    vCard += `FN:${name}\n`;
    vCard += `EMAIL:${email}\n`;
    vCard += `TEL:${phone}\n`;
    
    if (company) vCard += `ORG:${company}\n`;
    if (jobTitle) vCard += `TITLE:${jobTitle}\n`;
    if (website) vCard += `URL:${website}\n`;
    if (address) vCard += `ADR:;;${address};;;;\n`;
    
    vCard += 'END:VCARD';
    return vCard;
  };

  const vCard = generateVCard();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Scantact</Text>
        
        <Text style={styles.sectionTitle}>Required Fields</Text>
        <TextInput
          style={styles.input}
          placeholder="Name *"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone *"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>Optional Fields</Text>
        <TextInput
          style={styles.input}
          placeholder="Company"
          value={company}
          onChangeText={setCompany}
        />
        <TextInput
          style={styles.input}
          placeholder="Job Title"
          value={jobTitle}
          onChangeText={setJobTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Website"
          value={website}
          onChangeText={setWebsite}
          keyboardType="url"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <Button
          title="Generate QR Code"
          onPress={() => setShowQR(true)}
          disabled={!name || !email || !phone}
        />
        
        {showQR && (
          <View style={styles.qrContainer}>
            <QRCode value={vCard} size={220} />
            <Text style={styles.qrText}>Scan to add contact</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  qrContainer: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
