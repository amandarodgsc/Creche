import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../constants/colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { IconButton } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';

const ChildRegistration = ({ navigation }) => {
    const [submittedData, setSubmittedData] = useState([]);
    const [saveError, setSaveError] = useState(null);
    const [editIndex, setEditIndex] = useState(-1);
    const [touchedFields, setTouchedFields] = useState({});
    const [isChecked, setIsChecked] = useState(false);

    const handleSignup = async () => {
        try {
            // Limpar campos tocados
            setTouchedFields({});

            if (
                !formik.values.entryTime ||
                !formik.values.exitTime ||
                !formik.values.restTime ||
                !formik.values.childRegistrationNumber
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
            await AsyncStorage.setItem('child_data', JSON.stringify(newData));

            // Reseta o formulário e o índice de edição
            formik.resetForm();
            setEditIndex(-1);

            // Fetch and set the updated submittedData from AsyncStorage
            const updatedData = await AsyncStorage.getItem('child_data');
            setSubmittedData(JSON.parse(updatedData) || []);
        } catch (error) {
            console.error('Error saving data: ', error);
            setSaveError(error.message || 'Erro ao salvar os dados. Por favor, tente novamente.');
        } finally {
            // Informa ao useFormik que a submissão foi concluída
            formik.setSubmitting(false);
        }
    };

    const validationSchema = yup.object().shape({
        entryTime: yup.string().required('Campo obrigatório'),
        exitTime: yup.string().required('Campo obrigatório'),
        restTime: yup.string().required('Campo obrigatório'),
        mealPreference: yup.string(),
        childRegistrationNumber: yup.string().required('Campo obrigatório'),
    });

    const formik = useFormik({
        initialValues: {
            entryTime: '',
            exitTime: '',
            restTime: '',
            mealPreference: '',
            childRegistrationNumber: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSignup, // Make sure to use the handleSignup function here
    });
    
   
    const handleEdit = (index) => {
        const editedData = submittedData[index];

        if (
            !editedData.entryTime ||
            !editedData.exitTime ||
            !editedData.restTime ||
            !editedData.childRegistrationNumber
        ) {
            setSaveError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Atualiza o estado do formulário com os dados existentes
        formik.setValues({
            entryTime: editedData.entryTime || '',
            exitTime: editedData.exitTime || '',
            restTime: editedData.restTime || '',
            mealPreference: editedData.mealPreference || '',
            childRegistrationNumber: editedData.childRegistrationNumber || '',
        });

        // Define o índice de edição para o índice atual
        setEditIndex(index);
    };

    const handleDelete = async (index) => {
        try {
            const newData = submittedData.filter((_, i) => i !== index);
            await AsyncStorage.setItem('child_data', JSON.stringify(newData));
            setSubmittedData(newData);
        } catch (error) {
            console.error('Error deleting data: ', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ position: 'absolute', top: 10, left: 10 }}>
                    <Image
                        source={require("../assets/hero2.jpg")}
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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            
                <View style={{ flex: 1, marginHorizontal: 22 }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
Preferencias opcionais                    </Text>

                    {/* Horário de Entrada */}
                    <Text style={styles.label}>Horário de entrada:</Text>
                    <View style={styles.inputContainer}>
                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'HH:mm',
                            }}
                            placeholder="Digite o horário de entrada"
                            placeholderTextColor={COLORS.black}
                            keyboardType="numeric"
                            style={styles.input}
                            onChangeText={(text) => formik.setFieldValue('entryTime', text)}
                            value={formik.values.entryTime}
                        />
                    </View>

                    {/* Horário de Saída */}
                    <Text style={styles.label}>Horário de saída:</Text>
                    <View style={styles.inputContainer}>
                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'HH:mm',
                            }}
                            placeholder="Digite o horário de saída"
                            placeholderTextColor={COLORS.black}
                            keyboardType="numeric"
                            style={styles.input}
                            onChangeText={(text) => formik.setFieldValue('exitTime', text)}
                            value={formik.values.exitTime}
                        />
                    </View>

                    {/* Horário de Descanso */}
                    <Text style={styles.label}>Horário de descanso:</Text>
                    <View style={styles.inputContainer}>
                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'HH:mm',
                            }}
                            placeholder="Digite o horário de descanso"
                            placeholderTextColor={COLORS.black}
                            keyboardType="numeric"
                            style={styles.input}
                            onChangeText={(text) => formik.setFieldValue('restTime', text)}
                            value={formik.values.restTime}
                        />
                    </View>

                    {/* Preferência de Horário de Alimentação */}
                    <Text style={styles.label}>Preferência de horário de alimentação:</Text>
                    <View style={styles.inputContainer}>
                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'HH:mm',
                            }}
                            placeholder="Digite a preferência de horário de alimentação"
                            placeholderTextColor={COLORS.black}
                            keyboardType="numeric"
                            style={styles.input}
                            onChangeText={(text) => formik.setFieldValue('mealPreference', text)}
                            value={formik.values.mealPreference}
                        />
                    </View>

                    {/* Número de Cadastro da Criança */}
                    <Text style={styles.label}>Número de cadastro da criança:</Text>
                    <View style={styles.inputContainer}>
                        <TextInputMask
                            type={'cpf'}
                            placeholder="Digite o número de cadastro da criança"
                            placeholderTextColor={COLORS.black}
                            keyboardType="numeric"
                            style={styles.input}
                            onChangeText={(text) => formik.setFieldValue('childRegistrationNumber', text)}
                            value={formik.values.childRegistrationNumber}
                        />
                    </View>
                    <Button title="Cadastrar" filled onPress={formik.handleSubmit} style={{ marginTop: 18, marginBottom: 4 }} />

                    {saveError && (
                        <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{saveError}</Text>
                    )}

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Informações Cadastradas:</Text>
                        {submittedData.map((data, index) => (
                            <View key={index} style={{ marginTop: 20, borderColor: touchedFields[index] ? 'white' : 'transparent', borderWidth: 1, padding: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                                    Criança Cadastrada {index + 1}:
                                </Text>
                                <Text>Horário de entrada: {data.entryTime}</Text>
                                <Text>Horário de saída: {data.exitTime}</Text>
                                <Text>Horário de descanso: {data.restTime}</Text>
                                <Text>Preferência de horário de alimentação: {data.mealPreference}</Text>
                                <Text>Número de cadastro da criança: {data.childRegistrationNumber}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
        <Text style={{ textAlign: 'center', color: 'blue', marginLeft: 5 }}>Editar</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
            icon="delete"
            color="white"
            size={20}
            style={{ backgroundColor: 'red', borderRadius: 5 }}
            onPress={() => handleDelete(index)}
        />
        <Text style={{ textAlign: 'center', color: 'red', marginLeft: 0 }}>Deletar</Text>
    </View>
</View>

                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 8,
    },
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
});

export default ChildRegistration;
