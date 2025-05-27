import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Application {
  id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  photos: string[];
  createdAt: string;
}

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/products/applications/my');
        setApplications(response.data.data);
      } catch (error) {
        console.error('Ошибка загрузки заявок:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const renderApplication = ({ item }: { item: Application }) => (
    <View style={styles.applicationCard}>
      <View style={styles.photosRow}>
        {item.photos.slice(0, 2).map((photo, index) => (
          <Image 
            key={index} 
            source={{ uri: `http://ваш-сервер:5000${photo}` }} 
            style={styles.photo} 
          />
        ))}
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.date}>
          {format(new Date(item.createdAt), 'dd.MM.yyyy', { locale: ru })}
        </Text>
        <View style={[
          styles.statusBadge,
          item.status === 'approved' && styles.statusApproved,
          item.status === 'rejected' && styles.statusRejected
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'pending' && 'На рассмотрении'}
            {item.status === 'approved' && 'Одобрено'}
            {item.status === 'rejected' && 'Отклонено'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои заявки</Text>
      
      {applications.length === 0 ? (
        <Text style={styles.emptyText}>У вас нет заявок</Text>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderApplication}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  photosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  photo: {
    width: '48%',
    height: 120,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#FFA500',
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
  },
  statusRejected: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});