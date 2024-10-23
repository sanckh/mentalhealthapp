import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { saveUserContact } from '../../api/userContacts';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

const AddCrisisContactModal: React.FC<Props> = ({ visible, onClose, userId }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberType, setPhoneNumberType] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await saveUserContact(userId, phoneNumber, phoneNumberType);
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Add Crisis Contact</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
        />
        <TextInput
          value={phoneNumberType}
          onChangeText={setPhoneNumberType}
          placeholder="Phone Number Type"
          style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
        />
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <TouchableOpacity onPress={handleSubmit}>
          <Text>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AddCrisisContactModal;