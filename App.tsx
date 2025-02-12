import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    // 🔹 Récupérer le token FCM de l'appareil
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log('🔥 FCM Token:', token);
      } catch (error) {
        console.error('❌ Erreur lors de la récupération du token FCM:', error);
      }
    };

    getToken();

    // 🔹 Écoute des notifications en premier plan
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('📩 Notification reçue en premier plan:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'Vous avez une nouvelle notification'
      );
    });

    // 🔹 Gérer les clics sur les notifications (app en arrière-plan)
    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('📌 Notification cliquée (appli en arrière-plan):', remoteMessage);
      Alert.alert(
        'Notification cliquée',
        remoteMessage.notification?.body || 'Vous avez cliqué sur une notification'
      );
    });

    // 🔹 Vérifier si l'app a été ouverte via une notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🚀 App ouverte par une notification:', remoteMessage);
          Alert.alert(
            'App ouverte par une notification',
            remoteMessage.notification?.body || 'Vous avez ouvert l\'app via une notification'
          );
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  // 🔹 Gestion des notifications en arrière-plan
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('🌙 Notification reçue en arrière-plan:', remoteMessage);
      // Vous pouvez afficher une notification locale ici si nécessaire
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>React Native FCM (Android)</Text>
      {fcmToken && <Text style={{ fontSize: 14, marginTop: 10 }}>FCM Token: {fcmToken}</Text>}
      <Button
        title="Afficher le Token"
        onPress={() => Alert.alert('FCM Token', fcmToken || 'Token non disponible')}
      />
    </View>
  );
};

export default App;