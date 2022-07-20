import { useState } from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'

import { VStack } from 'native-base'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [patrimony, setPatrimony] = useState('')
  const [description, setDescription] = useState('')

  const navigation = useNavigation()

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      //validação caso os campos estejam preenchidos
      return Alert.alert('Solicitar', 'Preencha todos os campos.')
    }

    setIsLoading(true)

    firestore() //banco de dados utilizado importado de '@react-native-firebase/firestore'
      .collection('orders') //entre na coleção e caso não haja crei ela
      .add({
        //crie o documento ou dados
        patrimony, //conteudo digitado no campo de patrimonio
        description, //conteudo digitado no campo de descrição
        status: 'open', //conteudo vem como padrão em andamento => "open"
        created_at: firestore.FieldValue.serverTimestamp() //conteudo de data atual do servidor importado do firebase
      })
      .then(() => {
        //caso inserção seja sucesso
        Alert.alert('Solicitação', 'Sua solicitação foi criada com sucesso.')
        navigation.goBack()
      })
      .catch(err => {
        //caso inserção seja fracasso
        console.log(err)
        setIsLoading(false)
        return Alert.alert(
          'Solicitação',
          'Não foi possivel criar sua solicitação.'
        )
      })
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação" />

      <Input
        onChangeText={setPatrimony}
        placeholder="Número do patrimônio"
        mt={4}
      />

      <Input
        onChangeText={setDescription}
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
      />

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  )
}
