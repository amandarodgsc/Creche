import { View, Text, Image, Pressable, TextInput, TouchableOpacity, ScrollView, scrollViewRef } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [formData, setFormData] = useState({
        responsibleName: '',
        responsibleAddress: '',
        emailAddress: '',
        mobileNumber: '',
        cpf: ''
    });
    const handleNameChange = (text) => {
        setFormData({ ...formData, responsibleName: text });
    };

    const handleAddressChange = (text) => {
        setFormData({ ...formData, responsibleAddress: text });
    };

    const handleEmailChange = (text) => {
        setFormData({ ...formData, emailAddress: text });
    };

    const handleMobileNumberChange = (text) => {
        setFormData({ ...formData, mobileNumber: text });
    };

    const handleCPFChange = (text) => {
        setFormData({ ...formData, cpf: text });
    };

    
    const [submittedData, setSubmittedData] = useState(null);

    const handleSignup = async () => {
        try {
            // Armazenar os dados no AsyncStorage
            const existingData = await AsyncStorage.getItem('user_data');
            let newData = [];
            if (existingData !== null) {
                newData = JSON.parse(existingData);
            }
            newData.push(formData);
            await AsyncStorage.setItem('user_data', JSON.stringify(newData));

            setSubmittedData(formData);

            // Limpar os dados do formulário após o cadastro
            setFormData({
                responsibleName: '',
                responsibleAddress: '',
                emailAddress: '',
                mobileNumber: '',
                cpf: ''
            });

            // Não navegar para a lista de tarefas ou outra tela desejada após o cadastro
            // navigation.navigate("Login");
        } catch (error) {
            console.error("Error saving data: ", error);
        }
    };
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
    >
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
                        Cadastro do responsável
                    </Text>

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
                    }}>Nome do responsável</Text>

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
                            placeholder='Digite o nome do responsável'
                            placeholderTextColor={COLORS.black}
                            keyboardType='default'
                            style={{
                                width: "100%"
                            }}
                            onChangeText={handleNameChange} 
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Endereço do responsável</Text>

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
                            placeholder='Digite o endereço do responsável'
                            placeholderTextColor={COLORS.black}
                            keyboardType='default'
                            style={{
                                width: "100%"
                            }}
                            onChangeText={handleAddressChange} 
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email address</Text>

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
                            placeholder='Digite um e-mail valido'
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                            onChangeText={handleEmailChange}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Mobile Number</Text>

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
                            placeholder='+61'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "12%",
                                borderRightWidth: 1,
                                borderLeftColor: COLORS.grey,
                                height: "100%"
                            }}
                        />

                        <TextInput
                            placeholder='Coloque seu numero de Telefone'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "80%"
                            }}
                            onChangeText={handleMobileNumberChange}

                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>CPF do responsavel</Text>

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
                            placeholder='Coloque seu CPF'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                            onChangeText={handleCPFChange }

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
            onPress={handleSignup}
            style={{
                marginTop: 18,
                marginBottom: 4,
            }}
        />


                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14 }}>Lista de Tarefas diaria:</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                </View>

                {submittedData && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            Informações cadastradas:
                        </Text>
                        <Text>Nome: {submittedData.responsibleName}</Text>
                        <Text>Endereço: {submittedData.responsibleAddress}</Text>
                        <Text>Email: {submittedData.emailAddress}</Text>
                        <Text>Número de Telefone: {submittedData.mobileNumber}</Text>
                        <Text>CPF: {submittedData.cpf}</Text>
                    </View>
                )}

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
           

                    

                    <Text style={{ fontSize: 16, color: COLORS.black }}>Clique para ir para:</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Lista de Compras</Text>
                    </Pressable>
                </View>
            </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default Signup
