import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'react-native-paper';
import COLORS from '../constants/colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';

const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [submittedData, setSubmittedData] = useState([]);
    const [saveError, setSaveError] = useState(null);
    const [editIndex, setEditIndex] = useState(-1);
    const [touchedFields, setTouchedFields] = useState({});

    const handleFieldFocus = (field) => {
        setTouchedFields({ ...touchedFields, [field]: false });
    };

    const handleFieldBlur = (field) => {
        setTouchedFields({ ...touchedFields, [field]: true });
    };

    const handleFieldChange = (field, text) => {
        formik.handleChange(field)(text);
    };

    const validationSchema = yup.object().shape({
        responsibleName: yup.string().required('Campo obrigatório'),
        responsibleAddress: yup.string().required('Campo obrigatório'),
        emailAddress: yup.string().email('Email inválido').required('Campo obrigatório'),
        mobileNumber: yup.string().required('Campo obrigatório').min(11, 'Número de telefone inválido'),
        cpf: yup.string().required('Campo obrigatório').min(12, 'CPF inválido'),
    });


    const formik = useFormik({
        initialValues: {
            responsibleName: '',
            responsibleAddress: '',
            emailAddress: '',
            mobileNumber: '',
            cpf: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSignup,
    });

    const handleSignup = async () => {
        try {
            // Limpar campos tocados
            setTouchedFields({});

            if (
                !formik.values.responsibleName ||
                !formik.values.responsibleAddress ||
                !formik.values.emailAddress ||
                !formik.values.mobileNumber ||
                !formik.values.cpf
            ) {
                throw new Error('Por favor, preencha todos os campos obrigatórios.');
            }

            let newData = [...submittedData];

            // Verifica se está editando ou adicionando
            if (editIndex !== -1) {
                // Edição: substitui os dados existentes
                newData[editIndex] = formik.values;
            } else {
                // Adição: adiciona um novo cadastro
                newData.push(formik.values);
            }

            setSubmittedData(newData);
            setSaveError(null);
            await AsyncStorage.setItem('user_data', JSON.stringify(newData));

            // Reseta o formulário e o índice de edição
            formik.resetForm();
            setEditIndex(-1);
        } catch (error) {
            console.error('Error saving data: ', error);
            setSaveError(error.message || 'Erro ao salvar os dados. Por favor, tente novamente.');
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

        // Atualiza o estado do formulário com os dados existentes
        formik.setValues({
            responsibleName: editedData.responsibleName || '',
            responsibleAddress: editedData.responsibleAddress || '',
            emailAddress: editedData.emailAddress || '',
            mobileNumber: editedData.mobileNumber || '',
            cpf: editedData.cpf || '',
        });

        // Define o índice de edição para o índice atual
        setEditIndex(index);
    };

    const handleDelete = async (index) => {
        try {
            const newData = submittedData.filter((_, i) => i !== index);
            await AsyncStorage.setItem('user_data', JSON.stringify(newData));
            setSubmittedData(newData);
        } catch (error) {
            console.error('Error deleting data: ', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ position: 'absolute', top: 10, left: 10 }}>
                    <Image
                        source={require("../assets/hero3.jpg")}
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
                </View>

                <View style={{ flex: 1, marginHorizontal: 22 }}>
                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            marginVertical: 12,
                            color: COLORS.black
                        }}>
                            Cadastro da criança
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.black
                        }}>para mais segurança, e comunicação!</Text>
                    </View>

                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Nome da criança:</Text>
                    <View style={[styles.inputContainer, { borderColor: touchedFields.responsibleName ? (formik.values.responsibleName ? COLORS.grey : 'red') : COLORS.grey }]}>
                        <TextInput
                            placeholder="Digite o nome da criança"
                            placeholderTextColor={COLORS.black}
                            keyboardType="default"
                            style={styles.input}
                            onChangeText={(text) => handleFieldChange('responsibleName', text)}
                            onFocus={() => handleFieldFocus('responsibleName')}
                            onBlur={() => handleFieldBlur('responsibleName')}
                            value={formik.values.responsibleName}
                        />
                        {touchedFields.responsibleName && formik.errors.responsibleName && (
                            <Text style={{ color: 'red' }}>{formik.errors.responsibleName}</Text>
                        )}
                    </View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Endereço:</Text>
                    <View style={[styles.inputContainer, { borderColor: touchedFields.responsibleAddress ? (formik.values.responsibleAddress ? COLORS.grey : 'red') : COLORS.grey }]}>
                        <TextInput
                            placeholder="Digite o endereço da criança"
                            placeholderTextColor={COLORS.black}
                            keyboardType="default"
                            style={styles.input}
                            onChangeText={(text) => handleFieldChange('responsibleAddress', text)}
                            onFocus={() => handleFieldFocus('responsibleAddress')}
                            onBlur={() => handleFieldBlur('responsibleAddress')}
                            value={formik.values.responsibleAddress}
                        />
                        {touchedFields.responsibleAddress && formik.errors.responsibleAddress && (
                            <Text style={{ color: 'red' }}>{formik.errors.responsibleAddress}</Text>
                        )}
                    </View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email para contato:</Text>
                    <View style={[styles.inputContainer, { borderColor: touchedFields.emailAddress ? (formik.values.emailAddress ? COLORS.grey : 'red') : COLORS.grey }]}>
                        <TextInput
                            placeholder="Digite Email para contato"
                            placeholderTextColor={COLORS.black}
                            keyboardType="email-address"
                            style={styles.input}
                            onChangeText={(text) => handleFieldChange('emailAddress', text)}
                            onFocus={() => handleFieldFocus('emailAddress')}
                            onBlur={() => handleFieldBlur('emailAddress')}
                            value={formik.values.emailAddress}
                        />
                        {touchedFields.emailAddress && formik.errors.emailAddress && (
                            <Text style={{ color: 'red' }}>{formik.errors.emailAddress}</Text>
                        )}
                    </View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Numero de Telefone:</Text>
                    <View style={[styles.inputContainer, { borderColor: touchedFields.mobileNumber ? (formik.values.mobileNumber ? COLORS.grey : 'red') : COLORS.grey }]}>
                        <TextInputMask
                            type={'cel-phone'}
                            options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) ',
                            }}
                            placeholder="Coloque o numero de telefone do responsavel"
                            placeholderTextColor={COLORS.black}
                            keyboardType="numeric"
                            style={[styles.input, { width: '88%' }]}
                            onChangeText={(text) => handleFieldChange('mobileNumber', text)}
                            onFocus={() => handleFieldFocus('mobileNumber')}
                            onBlur={() => handleFieldBlur('mobileNumber')}
                            value={formik.values.mobileNumber}
                        />
                        {touchedFields.mobileNumber && formik.errors.mobileNumber && (
                            <Text style={{ color: 'red' }}>{formik.errors.mobileNumber}</Text>
                        )}
                    </View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>CPF da criança:</Text>
                    <View style={[styles.inputContainer, { borderColor: touchedFields.cpf ? (formik.values.cpf ? COLORS.grey : 'red') : COLORS.grey }]}>
                        <TextInputMask
                            type={'cpf'}
                            placeholder="Coloque o cpf da criança"
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={styles.input}
                            onChangeText={(text) => handleFieldChange('cpf', text)}
                            onFocus={() => handleFieldFocus('cpf')}
                            onBlur={() => handleFieldBlur('cpf')}
                            value={formik.values.cpf}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={styles.eyeIconContainer}
                        >
                            {isPasswordShown == true ? (
                                <Ionicons name="eye-off" size={24} color={COLORS.black} />
                            ) : (
                                <Ionicons name="eye" size={24} color={COLORS.black} />
                            )}
                        </TouchableOpacity>
                        {touchedFields.cpf && formik.errors.cpf && (
                            <Text style={{ color: 'red' }}>{formik.errors.cpf}</Text>
                        )}
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
                        <Text style={{ fontSize: 14 }}>Responsaveis cadastrados:</Text>
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
                        <View key={index} style={{ marginTop: 20, borderColor: touchedFields[index] ? 'white' : 'transparent', borderWidth: 1, padding: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                                Criança Cadastrada {index + 1}:
                            </Text>
                            <Text>Nome: {data.responsibleName}</Text>
                            <Text>Endereço: {data.responsibleAddress}</Text>
                            <Text>Email: {data.emailAddress}</Text>
                            <Text>Número de Telefone: {data.mobileNumber}</Text>
                            <Text>CPF: {data.cpf}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ marginRight: 10 }}>
                                    <IconButton
                                        icon="pencil"
                                        color="white"
                                        size={20}
                                        style={{ backgroundColor: 'white', borderRadius: 5 }}
                                        onPress={() => {
                                            handleEdit(index);
                                            setTouchedFields({ ...touchedFields, [index]: true });
                                        }}
                                    />
                                    <Text style={{ textAlign: 'center', color: 'blue' }}>Editar</Text>
                                </View>
                                <View>
                                    <IconButton
                                        icon="delete"
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 5,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: '100%',
        color: COLORS.black,
    },
    eyeIconContainer: {
        marginLeft: 12,
    },
});

export default Signup;
