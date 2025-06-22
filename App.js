import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

const PHONE_LABELS = ['Mobile', 'Work', 'Home', 'Other'];

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phones, setPhones] = useState([{ number: '', label: 'Mobile' }]);
  const [showQR, setShowQR] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState(0);
  const [customLabel, setCustomLabel] = useState('');
  
  // Additional fields state
  const [additionalFields, setAdditionalFields] = useState([]);

  const addPhone = () => {
    setPhones([...phones, { number: '', label: 'Mobile' }]);
  };

  const removePhone = (index) => {
    if (phones.length > 1) {
      const newPhones = phones.filter((_, i) => i !== index);
      setPhones(newPhones);
    }
  };

  const updatePhone = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = { ...newPhones[index], number: value };
    setPhones(newPhones);
  };

  const updatePhoneLabel = (index, label) => {
    const newPhones = [...phones];
    newPhones[index] = { ...newPhones[index], label };
    setPhones(newPhones);
  };

  const openLabelModal = (index) => {
    setSelectedPhoneIndex(index);
    setCustomLabel(phones[index].label);
    setShowLabelModal(true);
  };

  const selectLabel = (label) => {
    updatePhoneLabel(selectedPhoneIndex, label);
    setShowLabelModal(false);
  };

  const saveCustomLabel = () => {
    if (customLabel.trim()) {
      updatePhoneLabel(selectedPhoneIndex, customLabel.trim());
      setShowLabelModal(false);
    }
  };

  const addAdditionalField = (type) => {
    setAdditionalFields([...additionalFields, { id: Date.now(), type, value: '' }]);
  };

  const removeAdditionalField = (id) => {
    setAdditionalFields(additionalFields.filter(field => field.id !== id));
  };

  const updateAdditionalField = (id, value) => {
    setAdditionalFields(additionalFields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const generateVCard = () => {
    let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
    vCard += `FN:${name}\n`;
    vCard += `EMAIL:${email}\n`;
    
    // Add all phone numbers with labels
    phones.forEach((phone, index) => {
      if (phone.number.trim()) {
        let phoneType = 'TYPE=CELL';
        if (phone.label === 'Work') phoneType = 'TYPE=WORK';
        else if (phone.label === 'Home') phoneType = 'TYPE=HOME';
        else if (phone.label === 'Other') phoneType = 'TYPE=OTHER';
        
        vCard += `TEL;${phoneType}:${phone.number}\n`;
        // Add custom label as note if it's not a standard label
        if (!PHONE_LABELS.includes(phone.label)) {
          vCard += `NOTE:${phone.label} phone\n`;
        }
      }
    });
    
    // Add additional fields
    additionalFields.forEach(field => {
      if (field.value.trim()) {
        switch (field.type) {
          case 'company':
            vCard += `ORG:${field.value}\n`;
            break;
          case 'jobTitle':
            vCard += `TITLE:${field.value}\n`;
            break;
          case 'website':
            vCard += `URL:${field.value}\n`;
            break;
          case 'address':
            vCard += `ADR:;;${field.value};;;;\n`;
            break;
          case 'email':
            vCard += `EMAIL;TYPE=WORK:${field.value}\n`;
            break;
          case 'phone':
            vCard += `TEL;TYPE=WORK:${field.value}\n`;
            break;
          case 'note':
            vCard += `NOTE:${field.value}\n`;
            break;
        }
      }
    });
    
    vCard += 'END:VCARD';
    return vCard;
  };

  const vCard = generateVCard();
  const isFormValid = name.trim() && email.trim() && phones.some(phone => phone.number.trim());

  const renderPhoneInput = (phone, index) => (
    <View key={index} style={styles.inputGroup}>
      <View style={styles.inputHeader}>
        <Text style={styles.label}>
          {index === 0 ? 'Primary Phone' : `Phone ${index + 1}`}
        </Text>
        {phones.length > 1 && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removePhone(index)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.phoneInputContainer}>
        <TouchableOpacity
          style={styles.labelButton}
          onPress={() => openLabelModal(index)}
          activeOpacity={0.8}
        >
          <Text style={styles.labelButtonText}>{phone.label}</Text>
          <Text style={styles.labelButtonIcon}>▼</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.phoneInput}
          placeholder="Enter phone number"
          value={phone.number}
          onChangeText={(value) => updatePhone(index, value)}
          keyboardType="phone-pad"
          placeholderTextColor="#9E9E9E"
        />
      </View>
    </View>
  );

  const renderAdditionalField = (field) => (
    <View key={field.id} style={styles.inputGroup}>
      <View style={styles.inputHeader}>
        <Text style={styles.label}>{field.type.charAt(0).toUpperCase() + field.type.slice(1)}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeAdditionalField(field.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, field.type === 'address' && styles.textArea]}
        placeholder={`Enter ${field.type}`}
        value={field.value}
        onChangeText={(value) => updateAdditionalField(field.id, value)}
        keyboardType={field.type === 'email' || field.type === 'website' ? 'email-address' : 'default'}
        autoCapitalize={field.type === 'email' || field.type === 'website' ? 'none' : 'sentences'}
        multiline={field.type === 'address'}
        numberOfLines={field.type === 'address' ? 3 : 1}
        placeholderTextColor="#9E9E9E"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Scantact</Text>
          <Text style={styles.subtitle}>Generate QR codes for your contact information</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9E9E9E"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9E9E9E"
            />
          </View>
          
          {phones.map((phone, index) => renderPhoneInput(phone, index))}
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={addPhone}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Add Another Phone</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Text style={styles.sectionSubtitle}>Add optional fields to enhance your contact card</Text>
          
          {additionalFields.map(field => renderAdditionalField(field))}

          <View style={styles.addFieldsContainer}>
            <Text style={styles.addFieldsTitle}>Add More Fields</Text>
            <View style={styles.addFieldsGrid}>
              <TouchableOpacity
                style={styles.addFieldButton}
                onPress={() => addAdditionalField('company')}
                activeOpacity={0.8}
              >
                <Text style={styles.addFieldButtonText}>Company</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addFieldButton}
                onPress={() => addAdditionalField('jobTitle')}
                activeOpacity={0.8}
              >
                <Text style={styles.addFieldButtonText}>Job Title</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addFieldButton}
                onPress={() => addAdditionalField('website')}
                activeOpacity={0.8}
              >
                <Text style={styles.addFieldButtonText}>Website</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addFieldButton}
                onPress={() => addAdditionalField('address')}
                activeOpacity={0.8}
              >
                <Text style={styles.addFieldButtonText}>Address</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addFieldButton}
                onPress={() => addAdditionalField('email')}
                activeOpacity={0.8}
              >
                <Text style={styles.addFieldButtonText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addFieldButton}
                onPress={() => addAdditionalField('phone')}
                activeOpacity={0.8}
              >
                <Text style={styles.addFieldButtonText}>Phone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addFieldButton}
                onPress={() => addAdditionalField('note')}
                activeOpacity={0.8}
              >
                <Text style={styles.addFieldButtonText}>Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.generateButton, !isFormValid && styles.generateButtonDisabled]}
          onPress={() => setShowQR(true)}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text style={[styles.generateButtonText, !isFormValid && styles.generateButtonTextDisabled]}>
            Generate QR Code
          </Text>
        </TouchableOpacity>
        
        {showQR && (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Your Contact QR Code</Text>
            <Text style={styles.qrSubtitle}>Scan this code to add contact to your phone</Text>
            <View style={styles.qrContainer}>
              <QRCode value={vCard} size={240} />
            </View>
          </View>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Phone Label Selection Modal */}
      <Modal
        visible={showLabelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLabelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Phone Label</Text>
            
            {PHONE_LABELS.map((label) => (
              <TouchableOpacity
                key={label}
                style={styles.modalOption}
                onPress={() => selectLabel(label)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalOptionText}>{label}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.customLabelContainer}>
              <Text style={styles.customLabelTitle}>Or enter custom label:</Text>
              <TextInput
                style={styles.customLabelInput}
                placeholder="Enter custom label"
                value={customLabel}
                onChangeText={setCustomLabel}
                placeholderTextColor="#9E9E9E"
              />
              <TouchableOpacity
                style={styles.saveCustomButton}
                onPress={saveCustomLabel}
                activeOpacity={0.8}
              >
                <Text style={styles.saveCustomButtonText}>Save Custom Label</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowLabelModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#212121',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#FFFFFF',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  labelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
  },
  labelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
    flex: 1,
  },
  labelButtonIcon: {
    fontSize: 12,
    color: '#757575',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1976D2',
  },
  removeButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D32F2F',
  },
  addFieldsContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addFieldsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 12,
  },
  addFieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addFieldButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  addFieldButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1976D2',
  },
  generateButton: {
    backgroundColor: '#1976D2',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generateButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  generateButtonTextDisabled: {
    color: '#9E9E9E',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#424242',
  },
  customLabelContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  customLabelTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
  },
  customLabelInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#212121',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  saveCustomButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveCustomButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
});
