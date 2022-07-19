import { useNavigation } from '@react-navigation/native'
import { Heading, HStack, IconButton, useTheme, StyledProps } from 'native-base'
import { CaretLeft } from 'phosphor-react-native'

type Props = StyledProps & {
  title: string
}

export function Header({title, ...rest}: Props) {
  const navigation = useNavigation()

  const { colors } = useTheme()

  function HandleGoBack(){
    navigation.goBack()
  }
  
  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      pb={6}
      pt={12}
      {...rest}
    >

      <IconButton icon={<CaretLeft size={24} color={colors.gray[200]} />} onPress={HandleGoBack} />

      <Heading
        color='gray.100' textAlign='center' fontSize='lg' flex={1} ml={-6}
      >{title}</Heading>

    </HStack>
  )
}
