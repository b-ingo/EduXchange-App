import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';

const CompactCardHeader = ({ item, onEditPress }) => {
  // your icon selection logic remains the same
  let icon;
  switch (item.category) {
      case 'books':
          icon = 'book-open-page-variant-outline';
          break;
      case 'notes':
          icon = 'note';
          break;
      case 'exam guides':
          icon = 'file-document-outline';
          break;
      case 'materials':
          icon = 'clipboard-text';
          break;
      case 'supplies':
          icon = 'pencil-ruler';
          break;
      case 'videos':
          icon = 'video';
          break;
      case 'tutoring':
          icon = 'account-tie';
          break;
      default:
          icon = 'file'; // Default icon
  }

  return (
    <View style={styles.container}>
      <Avatar.Icon 
        icon={icon} 
        size={30} // smaller size
        style={styles.avatar} 
      />
      <Text numberOfLines={1} style={styles.title}>
        {item.title}
      </Text>
      <TouchableOpacity onPress={onEditPress} style={{ marginLeft: 'auto' }}>
        <IconButton 
          icon="dots-vertical" 
          size={20} // smaller size
          onPress={onEditPress} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5, // or even less padding
  },
  avatar: {
    backgroundColor: '#63529F', 
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 14, // smaller font size
  },
});

export default CompactCardHeader;
