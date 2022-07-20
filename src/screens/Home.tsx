import { useState, useEffect } from 'react'
import { Alert } from 'react-native'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'

import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center
} from 'native-base'

import { ChatTeardropText, SignOut } from 'phosphor-react-native'
import Logo from '../assets/logo_secondary.svg'

import { Filter } from '../components/Filter'
import { Button } from '../components/Button'
import { Order, OrderProps } from '../components/Order'

import { dateFormat } from '../utils/firestoreDateFormat'
import { Loading } from '../components/Loading'

export function Home() {
  const [loading, setLoading] = useState(true)
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>(
    'open'
  )
  const [orders, setOrders] = useState<OrderProps[]>([])

  const navigation = useNavigation()
  const { colors } = useTheme()

  function handleNewOrder() {
    navigation.navigate('new')
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId })
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch(err => {
        console.log(err)
        return Alert.alert('Sair', 'Não foi possivel sair.')
      })
  }

  useEffect(() => {
    setLoading(true)

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          //percorrer dados recebidos após receber os mesmos da coleção informada em ".collection('orders')"
          const { patrimony, description, status, created_at } = doc.data()

          return {
            //retornando dados formatador para variavel data
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at)
          }
        })

        setOrders(data)
        setLoading(false)
      })

    return subscriber
  }, [statusSelected])

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Solicitações</Heading>
          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="Em Andamento"
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />
          <Filter
            type="closed"
            title="Finalizados"
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText size={40} color={colors.gray[300]} />
                <Text color="gray.200" fontSize="xl" mt={6} textAlign="center">
                  Você ainda não possui {'\n'}
                  solicitações{' '}
                  {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova Solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  )
}
