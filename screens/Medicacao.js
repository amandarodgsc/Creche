import { View, Text, Pressable, TextInput, TouchableOpacity, ScrollView, scrollViewRef, Image} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'react-native-paper';


const Medicacao = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [formData, setFormData] = useState({
        responsibleName: '',
        responsibleAddress: '',
        emailAddress: '',
        mobileNumber: '',
        cpf: ''
    });
    const [submittedData, setSubmittedData] = useState([]);
    const [saveError, setSaveError] = useState(null);
    const [editIndex, setEditIndex] = useState(-1);

    const handleNameChange = (text) => setFormData({ ...formData, responsibleName: text });
    const handleAddressChange = (text) => setFormData({ ...formData, responsibleAddress: text });
    const handleEmailChange = (text) => setFormData({ ...formData, emailAddress: text });
    const handleMobileNumberChange = (text) => setFormData({ ...formData, mobileNumber: text });
    const handleCPFChange = (text) => setFormData({ ...formData, cpf: text });
    const validateEmail = (email) => {
        // Expressão regular para validar o email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };
    

    const handleLogin = async () => {
        try {
            // Validação dos campos obrigatórios
            if (
                !formData.responsibleName ||
                !formData.responsibleAddress ||
                !formData.mobileNumber ||
                !formData.cpf
            ) {
                throw new Error('Por favor, preencha todos os campos obrigatórios.');
            }
    
            let newData = [...submittedData]; // Criando uma cópia dos dados submetidos
            newData.push(formData); // Adicionando o novo formulário aos dados submetidos
    
            // Atualiza os dados submetidos e limpa o estado dos campos do formulário
            setSubmittedData(newData);
            setSaveError(null);
            await AsyncStorage.setItem('user_data', JSON.stringify(newData));
    
            // Limpa os campos do formulário
            setFormData({
                responsibleName: '',
                responsibleAddress: '',
                mobileNumber: '',
                cpf: ''
            });
    
            // Navega para a próxima tela ou executa outra ação necessária
            // navigation.navigate("Login");
        } catch (error) {
            console.error("Error saving data: ", error);
            setSaveError(error.message || "Erro ao salvar os dados. Por favor, tente novamente.");
        }
    };



    const handleEdit = (index) => {
        const editedData = submittedData[index];

        if (
            !editedData.responsibleName ||
            !editedData.responsibleAddress ||
            !editedData.emailAddress ||
            !editedData.mobileNumber ||
            !editedData.cpf
        ) {
            setSaveError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        setFormData({
            responsibleName: editedData.responsibleName || '',
            responsibleAddress: editedData.responsibleAddress || '',
            emailAddress: editedData.emailAddress || '',
            mobileNumber: editedData.mobileNumber || '',
            cpf: editedData.cpf || '',
        });
        setEditIndex(index);
    };




    const handleDelete = async (index) => {
        try {
            const newData = submittedData.filter((_, i) => i !== index);
            await AsyncStorage.setItem('user_data', JSON.stringify(newData));
            setSubmittedData(newData);
        } catch (error) {
            console.error("Error deleting data: ", error);
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ position: 'absolute', top: 10, left: 10 }}>
        <Image
          source={require("../assets/hero5.jpg")} // Substitua pelo caminho da sua primeira imagem
          style={{
            height: 100,
            width: 100,
            borderRadius: 20,
            transform: [
              { translateX: 285 },
              { translateY: 0 },
              { rotate: "1deg" }
            ]
          }}
        />
        {/* Adicione mais imagens seguindo o mesmo padrão... */}
      </View>
                <View style={{ flex: 1, marginHorizontal: 22 }}>
                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            marginVertical: 12,
                            color: COLORS.black
                        }}>
Medicaçoes e informações                        </Text>

                        <Text style={{
                            fontSize: 16,
                            color: COLORS.black
                        }}>para mais segurança, e comunicação!</Text>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Alergia a medicamento</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Digite a qual medicamento a criança é alergica'
                                placeholderTextColor={COLORS.black}
                                keyboardType='default'
                                style={{ width: "100%" }}
                                onChangeText={handleNameChange}
                                value={formData.responsibleName}
                            />

                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Remedio de uso continuo</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Qual remedio é de uso continuo'
                                placeholderTextColor={COLORS.black}
                                keyboardType='default'
                                style={{
                                    width: "100%",
                                    borderLeftColor: COLORS.grey,
                                    height: "100%"}}
                                onChangeText={handleAddressChange}
                                value={formData.responsibleAddress}
                            />

                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Horario do medicamento</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Quais horarios?'
                                placeholderTextColor={COLORS.black}
                                keyboardType='email-address'
                                style={{ width: "100%" }}
                                onChangeText={handleEmailChange}
                                value={formData.emailAddress} // Corrigido de formData.responsibleEmailAdress para formData.emailAddress
                                />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Numero de emergencia</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 22
                        }}>
                            

                            <TextInput
                                placeholder='Numero de emergencia medica'
                                placeholderTextColor={COLORS.black}
                                keyboardType='defalut'
                                style={{ width: "100%" }}
                                onChangeText={handleMobileNumberChange}
                                value={formData.mobileNumber} // Corrigido de formData.responsibleNumber para formData.mobileNumber
                                />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Numero Carteirinha convenio</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Coloque o numero da carteirinha'
                                placeholderTextColor={COLORS.black}
                                secureTextEntry={isPasswordShown}
                                style={{ width: "100%" }}
                                onChangeText={handleCPFChange}
                                value={formData.cpf} // Corrigido de formData.responsiblecpf para formData.cpf
                                />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: "absolute",
                                    right: 12
                                }}
                            >
                                {
                                    isPasswordShown == true ? (
                                        <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                    ) : (
                                        <Ionicons name="eye" size={24} color={COLORS.black} />
                                    )
                                }

                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 6
                    }}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            value={isChecked}
                            onValueChange={setIsChecked}
                            color={isChecked ? COLORS.primary : undefined}
                        />

                        <Text>Eu estou de acordo com as regras </Text>
                    </View>

                    <Button
                        title="Cadastre"
                        filled
                        onPress={handleLogin}
                        style={{
                            marginTop: 18,
                            marginBottom: 4,
                        }}
                    />

                    {saveError && (
                        <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
                            {saveError}
                        </Text>
                    )}

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: COLORS.grey,
                                marginHorizontal: 10
                            }}
                        />
                        <Text style={{ fontSize: 14 }}>Medicações e Informações:</Text>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: COLORS.grey,
                                marginHorizontal: 10
                            }}
                        />
                    </View>


                    {submittedData.map((data, index) => (
                        <View key={index} style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                                Medicações e Informações {index + 1}:
                            </Text>
                            <Text>Alergia a medicamento: {data.responsibleName}</Text>
                            <Text>Remedio continuo: {data.responsibleAddress}</Text>
                            <Text>Horarios de remedio: {data.emailAddress}</Text>
                            <Text>Numero de emergencia: {data.mobileNumber}</Text>
                            <Text>Numero carteirinha plano: {data.cpf}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ marginRight: 10 }}>
                                    <IconButton
                                        icon="pencil" // Substitua pelo ícone de edição desejado
                                        color="white"
                                        size={20}
                                        style={{ backgroundColor: 'white', borderRadius: 5 }}
                                        onPress={() => handleEdit(index)}
                                    />
                                    <Text style={{ textAlign: 'center', color: 'blue' }}>Editar</Text>
                                </View>
                                <View>
                                    <IconButton
                                        icon="delete" // Substitua pelo ícone de deleção desejado
                                        color="white"
                                        size={20}
                                        style={{ backgroundColor: 'red', borderRadius: 5 }}
                                        onPress={() => handleDelete(index)}
                                    />
                                    <Text style={{ textAlign: 'center', color: 'red' }}>Deletar</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginVertical: 22
                    }}>




                       
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default Medicacao
