import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen 
          name="doc/home" 
          options={{ 
            title: 'Inicio',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="doc/request" 
          options={{ 
            title: 'Solicitudes Pendientes',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="doc/requestDetails" 
          options={{ 
            title: 'Detalle de Solicitud',
            headerShown: false 
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}
