import { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { Heading, VStack, Icon, useTheme } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import Logo from '../assets/logo_primary.svg'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from 'react-native'
import { Loading } from '../components/Loading'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const { colors } = useTheme()

  function handleSighIn() {
    if(!email || !password){
      return Alert.alert('Entrar', 'Informar e-mail e senha.')
    }
    setIsLoading(true)

    auth()//função auth importada do '@react-native-firebase/auth'
      .signInWithEmailAndPassword(email,password)//escolhendo metodo de autenticação com email e senha e recebendo as variaveis
      .catch((error) => {//tratamento de erros
        console.log(error)
        setIsLoading(false)

        if(error.code === 'auth/invalid-email'){//caso o e-mail não esteja como um padrão de e-mail
          return Alert.alert('Email', 'E-mail inválido.')
        }

        if(error.code === 'auth/wrong-password'){//caso a senha esteja incorreta
          return Alert.alert('Entrar', 'E-mail ou senha inválida.')
        }

        if(error.code === 'auth/user-not-found'){//caso o usuario não exista
          return Alert.alert('Entrar', 'E-mail ou senha inválida.')
        }

        //caso ocorra qualquer outro erro
        //viasualizar motivo no console
        return Alert.alert('Entrar', 'Não foi possivel acessar...')
        
      })


    console.log(email, password)
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />

      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        title="Entrar" 
        w="full" 
        onPress={handleSighIn}
        isLoading={isLoading}
      />
    </VStack>
  )
}
