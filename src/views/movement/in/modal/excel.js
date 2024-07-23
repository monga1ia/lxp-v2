// import message from 'modules/message'
// import React, { useEffect, useState } from 'react'
// import  { StepsStyleConfig }  from 'chakra-ui'
// import { movementInExcelUpload } from 'utils/fetchRequest/Urls'
// import secureLocalStorage from 'react-secure-storage'
// import { useTranslation } from "react-i18next";
// import { fetchRequest } from 'utils/fetchRequest'
// import { ReactSpreadsheetImport } from 'react-spreadsheet-import'

// const excel = ({ onClose, onSubmit, open }) => {
//     const { t } = useTranslation();
//     // const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

//     const MatchIconTheme = {
//         baseStyle: props => {
//             return {
//                 ...StepsStyleConfig.baseStyle(props).stepIconContainer,
//                 borderWidth: '2px',
//                 bg: 'background',
//                 borderColor: 'rsi.500',
//                 color: 'background',
//                 transitionDuration: 'ultra-fast',
//             }
//         },
//         defaultProps: {
//             size: 'md',
//             colorScheme: 'rsi',
//         },
//     }

//     const headingStyle = {
//         fontSize: '2xl',
//         color: 'rsi.500',
//         fontFamily: 'MulishRegular',
//     }

//     const titleStyle = {
//         fontSize: 'xl',
//         color: '#575962',
//     }

//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/
//     const nameRegex = /^[A-Za-zА-Яа-яӨҮөүЁё-]+$/
//     const regNumberRegex = /^[А-ЯӨҮЁ]{2}\d{8}$/

//     const genderOptions = [
//         {
//             label: t('male'),
//             value: 'M',
//         },
//         {
//             label: t('female'),
//             value: 'F',
//         },
//     ]

//     const refFields = [
//         {
//             key: 'startDate',
//             label: t('student.entry_date'),
//             alternateMatches: ['Элссэн огноо', 'Элссэн', 'огноо', 'Элсэх огноо', 'элсэх'],
//             fieldType: { type: 'input' },
//             description: t('sheetImport.regex.date'),
//             example: '2022-09-01',
//             validations: [
//                 {
//                     rule: 'required',
//                     errorMessage: t('sheetImport.required.enrolDate'),
//                 },
//                 {
//                     rule: 'regex',
//                     value: dateRegex,
//                     errorMessage: t('sheetImport.regex.date'),
//                 },
//             ],
//         },
//         {
//             key: 'grade',
//             label: t('group.name'),
//             alternateMatches: ['Анги', 'Бүлэг'],
//             fieldType: {
//                 type: 'select',
//             },
//             description: t('sheetImport.required.grade'),
//             example: '1Б',
//             validations: [
//                 {
//                     rule: 'required',
//                     errorMessage: t('sheetImport.required.grade'),
//                 },
//             ],
//         },
//         {
//             key: 'code',
//             label: t('student.student_code'),
//             alternateMatches: ['Сурагчийн код', 'код'],
//             fieldType: { type: 'input' },
//             description: t('sheetImport.unique.studentCode'),
//             example: 'HG746483',
//             validations: [
//                 {
//                     rule: 'required',
//                     errorMessage: t('sheetImport.required.studentCode'),
//                 },
//                 {
//                     rule: 'unique',
//                     errorMessage: t('sheetImport.unique.studentCode'),
//                 },
//             ],
//         },
//         {
//             key: 'lastName',
//             label: t('student.last_name'),
//             alternateMatches: ['Сурагчийн овог', 'овог', 'Эцэг эхийн нэр', 'Эцэг эх'],
//             fieldType: { type: 'input' },
//             description: t('sheetImport.regex.latinAndCyrillic'),
//             example: 'Дорж',
//             validations: [
//                 {
//                     rule: 'required',
//                     errorMessage: t('sheetImport.required.studentLastName'),
//                 },
//                 {
//                     rule: 'regex',
//                     value: nameRegex,
//                     errorMessage: t('sheetImport.regex.latinAndCyrillic'),
//                 },
//             ],
//         },
//         {
//             key: 'firstName',
//             label: t('student.first_name'),
//             alternateMatches: ['Сурагчийн нэр', 'нэр', 'Өөрийн нэр'],
//             fieldType: { type: 'input' },
//             description: t('sheetImport.regex.latinAndCyrillic'),
//             example: 'Баяр',
//             validations: [
//                 {
//                     rule: 'required',
//                     errorMessage: t('sheetImport.required.studentFirstName'),
//                 },
//                 {
//                     rule: 'regex',
//                     value: nameRegex,
//                     errorMessage: t('sheetImport.regex.latinAndCyrillic'),
//                 },
//             ],
//         },
//         {
//             key: 'birthDate',
//             label: t('student.birth_date'),
//             alternateMatches: ['Төрсөн өдөр', 'Төрсөн', 'өдөр', 'төрөх', 'Төрсөн огноо'],
//             fieldType: { type: 'input' },
//             description: t('sheetImport.desc.notRequired'),
//             example: '2002-02-02',
//         },
//         {
//             key: 'gender',
//             label: t('student.gender'),
//             alternateMatches: ['хүйс', 'эр эм', 'эр', 'эм', 'эрэгтэй', 'эмэгтэй'],
//             description: t('sheetImport.desc.gender'),
//             example: 'Эрэгтэй',
//             fieldType: {
//                 type: 'select',
//                 options: genderOptions,
//             },
//             validations: [
//                 {
//                     rule: 'required',
//                     errorMessage: t('sheetImport.required.gender'),
//                 },
//             ],
//         },
//         {
//             key: 'registerNumber',
//             label: t('student.register_number'),
//             alternateMatches: ['Регистрийн дугаар', 'дугаар', 'Регистр'],
//             description: t('sheetImport.desc.notRequiredv'),
//             fieldType: { type: 'input' },
//             example: 'АА02202015',
//             validations: [
//                 {
//                     rule: 'unique',
//                     allowEmpty: true,
//                     errorMessage: t('sheetImport.unique.regNumber'),
//                 },
//             ],
//         },
//     ]

//     const [fields, setFields] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [gradeOptions, setGradeOptions] = useState([])

//     useEffect(() => {
//         setLoading(true)
//         // fetchRequest(movementInExcelUpload, 'POST')
//         //     .then((res) => {
//         //         if (res.success) {
//         //             const { classes, schoolInfo } = res.data
//         //             setGradeOptions(classes || [])
//         //             refFields.find(el => el.key == 'grade').fieldType.options = classes || []
//         //             if (schoolInfo?.isGenerateCode) refFields.splice(refFields.findIndex(el => el.key == 'code'), 1)
//         //             setFields(refFields)
//         //         } else {
//         //             message(res.data.message)
//         //         }
//         //         setLoading(false)
//         //     })
//         //     .catch(() => {
//         //         message(t('err.error_occurred'))
//         //         setLoading(false)
//         //     })
//     }, [])

//     const handleUploadStepHook = data => {
//         if (!data?.length) {
//             onClose()
//             message(t('err.file_empty'))
//         }
//         return data
//     }

//     const handleMatchColumnsStepHook = (data, rawData, columns) => {
//         const genderIndex = columns?.find(el => el?.value == 'gender')?.index
//         const gradeIndex = columns?.find(el => el?.value == 'grade')?.index
//         const codeIndex = columns?.find(el => el?.value == 'code')?.index
//         rawData?.forEach((row, index) => {
//             const gender = row?.[genderIndex]?.toString()?.replace(/\s/g, '')?.toLowerCase()
//             const grade = row?.[gradeIndex]?.toString()?.replace(/\s/g, '')?.toLowerCase()
//             data[index].gender = genderOptions?.find(el => el?.label?.toLowerCase() == gender)?.value
//             data[index].grade = gradeOptions?.find(el => el?.label?.toLowerCase() == grade)?.value
//             data[index].code = row?.[codeIndex]?.toString()?.replace(/\s/g, '')?.toUpperCase()
//         })
//         return data
//     }

//     const handleRowHook = (row, addError) => {
//         Object.keys(row)?.forEach(key => {
//             const value = row?.[key]?.toString()?.replace(/\s/g, '')
//             switch (key) {
//                 case 'registerNumber':
//                     row[key] = value?.toUpperCase()
//                     if (row[key] && !regNumberRegex.test(row[key])) addError(key, { message: t('sheetImport.regex.regNumber'), level: 'error' })
//                     break
//                 case 'birthDate':
//                     row[key] = value
//                     if (row[key] && !dateRegex.test(row[key])) addError(key, { message: t('sheetImport.regex.date'), level: 'error' })
//                     break
//                 case 'code':
//                     row[key] = value?.toUpperCase()
//                     break
//                 default:
//                     row[key] = value
//                     break
//             }
//         })
//         return row
//     }

//     return (
//         <>
//             <ReactSpreadsheetImport
//                 isOpen={open}
//                 fields={fields}
//                 rowHook={handleRowHook}
//                 allowInvalidSubmit={false}
//                 onClose={() => { onClose() }}
//                 uploadStepHook={handleUploadStepHook}
//                 matchColumnsStepHook={handleMatchColumnsStepHook}
//                 onSubmit={(data) => { onSubmit(data?.validData) }}
//                 translations={{ ...t('sheetImport') }}
//                 customTheme={{
//                     colors: {
//                         rsi: {
//                             50: '#FFE0D5',
//                             100: '#FFD1C0',
//                             200: '#FFB497',
//                             300: '#FF966F',
//                             400: '#FF7946',
//                             500: '#FF5B1D',
//                             600: '#E43F00',
//                             700: '#AC2F00',
//                             800: '#742000',
//                             900: '#3C1000',
//                         },
//                         green: {
//                             50: '#FFE0D5',
//                             100: '#FFD1C0',
//                             200: '#FFB497',
//                             300: '#FF966F',
//                             400: '#FF7946',
//                             500: '#FF5B1D',
//                             600: '#E43F00',
//                             700: '#AC2F00',
//                             800: '#742000',
//                             900: '#3C1000',
//                         }
//                     },
//                     components: {
//                         UploadStep: {
//                             baseStyle: {
//                                 heading: headingStyle,
//                                 title: titleStyle,
//                             },
//                         },
//                         SelectSheetStep: {
//                             baseStyle: {
//                                 heading: headingStyle,
//                             },
//                         },
//                         SelectHeaderStep: {
//                             baseStyle: {
//                                 heading: headingStyle,
//                             },
//                         },
//                         MatchColumnsStep: {
//                             baseStyle: {
//                                 heading: headingStyle,
//                                 title: titleStyle,
//                             },
//                         },
//                         ValidationStep: {
//                             baseStyle: {
//                                 heading: headingStyle,
//                             },
//                         },
//                         MatchIcon: MatchIconTheme,
//                     },
//                 }}
//             />
//             {
//                 loading &&
//                 <>
//                     <div className='blockUI blockOverlay' />
//                     <div className='blockUI blockMsg blockPage'>
//                         <div className='m-loader m-loader--brand m-loader--lg' />
//                     </div>
//                 </>
//             }
//         </>
//     )
// }

// export default excel