import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'react-native-paper';
import COLORS from '../constants/colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';

const Nutricao = ({ navigation }) => {
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
    peso: yup.string().required('Campo obrigatório'),
    altura: yup.string().required('Campo obrigatório'),
    alimentacoesPorDia: yup.string().required('Campo obrigatório'),
    horariosDeAlimentacao: yup.string().required('Campo obrigatório'),
    alergiaMedicamento: yup.string().nullable(),
    remedioContinuo: yup.string().nullable(),
    horarioMedicamento: yup.string().nullable(),
    numeroEmergencia: yup.string().matches(/^\d{10}$/, 'Número de emergência inválido').nullable(),
    numeroCarteirinhaConvenio: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Número de carteirinha inválido').nullable(),
  });

  const formik = useFormik({
    initialValues: {
      peso: '',
      altura: '',
      alimentacoesPorDia: '',
      horariosDeAlimentacao: '',
      alergiaMedicamento: '',
      remedioContinuo: '',
      horarioMedicamento: '',
      numeroEmergencia: '',
      numeroCarteirinhaConvenio: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleNutricao,
  });

  const handleNutricao = async () => {
    try {
      setTouchedFields({});

      if (
        !formik.values.peso ||
        !formik.values.altura ||
        !formik.values.alimentacoesPorDia ||
        !formik.values.horariosDeAlimentacao
      ) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      let newData = [...submittedData];

      if (editIndex !== -1) {
        newData[editIndex] = formik.values;
      } else {
        newData.push(formik.values);
      }

      setSubmittedData(newData);
      setSaveError(null);
      await AsyncStorage.setItem('child_data', JSON.stringify(newData));

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
      !editedData.peso ||
      !editedData.altura ||
      !editedData.alimentacoesPorDia ||
      !editedData.horariosDeAlimentacao
    ) {
      setSaveError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    formik.setValues({
      peso: editedData.peso || '',
      altura: editedData.altura || '',
      alimentacoesPorDia: editedData.alimentacoesPorDia || '',
      horariosDeAlimentacao: editedData.horariosDeAlimentacao || '',
      alergiaMedicamento: editedData.alergiaMedicamento || '',
      remedioContinuo: editedData.remedioContinuo || '',
      horarioMedicamento: editedData.horarioMedicamento || '',
      numeroEmergencia: editedData.numeroEmergencia || '',
      numeroCarteirinhaConvenio: editedData.numeroCarteirinhaConvenio || '',
    });

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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ position: 'absolute', top: 10, left: 10 }}>
          <Image
            source={require("../assets/hero6.jpg")}
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
Nutrição            </Text>
            <Text style={{
              fontSize: 16,
              color: COLORS.black
            }}>para mais segurança, e comunicação!</Text>
          </View>

          

          <Text style={{
  fontSize: 16,
  fontWeight: 400,
  marginVertical: 8
}}>Peso da criança:</Text>
<View style={[styles.inputContainer, { borderColor: touchedFields.peso ? (formik.values.peso ? COLORS.grey : 'red') : COLORS.grey }]}>
  {/* Substitua o TextInput por TextInputMask */}
  <TextInputMask
    type={'custom'}
    options={{
      mask: '9.99 kg',  // Máscara para o campo de peso
    }}
    placeholder="Digite o peso da criança"
    placeholderTextColor={COLORS.black}
    keyboardType="numeric"
    style={styles.input}
    onChangeText={(text) => handleFieldChange('peso', text)}
    onFocus={() => handleFieldFocus('peso')}
    onBlur={() => handleFieldBlur('peso')}
    value={formik.values.peso}
  />
  {touchedFields.peso && formik.errors.peso && (
    <Text style={{ color: 'red' }}>{formik.errors.peso}</Text>
  )}
</View>

<Text style={{
  fontSize: 16,
  fontWeight: 400,
  marginVertical: 8
}}>Altura da criança:</Text>
<View style={[styles.inputContainer, { borderColor: touchedFields.altura ? (formik.values.altura ? COLORS.grey : 'red') : COLORS.grey }]}>
  {/* Substitua o TextInput por TextInputMask */}
  <TextInputMask
    type={'custom'}
    options={{
      mask: '9.99 m',  // Máscara para o campo de altura
    }}
    placeholder="Digite a altura da criança"
    placeholderTextColor={COLORS.black}
    keyboardType="numeric"
    style={styles.input}
    onChangeText={(text) => handleFieldChange('altura', text)}
    onFocus={() => handleFieldFocus('altura')}
    onBlur={() => handleFieldBlur('altura')}
    value={formik.values.altura}
  />
  {touchedFields.altura && formik.errors.altura && (
    <Text style={{ color: 'red' }}>{formik.errors.altura}</Text>
  )}
</View>

<Text style={{
  fontSize: 16,
  fontWeight: 400,
  marginVertical: 8
}}>Alimentações por dia:</Text>
<View style={[styles.inputContainer, { borderColor: touchedFields.alimentacoesPorDia ? (formik.values.alimentacoesPorDia ? COLORS.grey : 'red') : COLORS.grey }]}>
  {/* Limitar o número de dígitos para 1 */}
  <TextInputMask
    type={'only-numbers'}
    options={{
      precision: 0,  // Limita para 0 dígitos após o ponto decimal
    }}
    placeholder="Digite a quantidade de alimentações por dia"
    placeholderTextColor={COLORS.black}
    keyboardType="numeric"
    style={styles.input}
    onChangeText={(text) => handleFieldChange('alimentacoesPorDia', text)}
    onFocus={() => handleFieldFocus('alimentacoesPorDia')}
    onBlur={() => handleFieldBlur('alimentacoesPorDia')}
    value={formik.values.alimentacoesPorDia}
  />
  {touchedFields.alimentacoesPorDia && formik.errors.alimentacoesPorDia && (
    <Text style={{ color: 'red' }}>{formik.errors.alimentacoesPorDia}</Text>
  )}
</View>

<Text style={{
  fontSize: 16,
  fontWeight: 400,
  marginVertical: 8
}}>Horários de Alimentação:</Text>
<View style={[styles.inputContainer, { borderColor: touchedFields.horariosDeAlimentacao ? (formik.values.horariosDeAlimentacao ? COLORS.grey : 'red') : COLORS.grey }]}>
  {/* Adicione uma máscara para o campo de horários */}
  <TextInputMask
    type={'datetime'}
    options={{
      format: 'HH:mm',  // Máscara para o campo de horários
    }}
    placeholder="Digite os horários de alimentação"
    placeholderTextColor={COLORS.black}
    keyboardType="numeric"
    style={styles.input}
    onChangeText={(text) => handleFieldChange('horariosDeAlimentacao', text)}
    onFocus={() => handleFieldFocus('horariosDeAlimentacao')}
    onBlur={() => handleFieldBlur('horariosDeAlimentacao')}
    value={formik.values.horariosDeAlimentacao}
  />
  {touchedFields.horariosDeAlimentacao && formik.errors.horariosDeAlimentacao && (
    <Text style={{ color: 'red' }}>{formik.errors.horariosDeAlimentacao}</Text>
  )}
</View>

          <Button
            title="Cadastrar"
            filled
            onPress={handleNutricao}
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
            <Text style={{ fontSize: 14 }}>Crianças cadastradas:</Text>
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
              <Text>Peso: {data.peso}</Text>
              <Text>Altura: {data.altura}</Text>
              <Text>Alimentações por dia: {data.alimentacoesPorDia}</Text>
              <Text>Horários de Alimentação: {data.horariosDeAlimentacao}</Text>
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
export default Nutricao