const ex = {
  "key": "paymentResponse",
  "value": "{\"id\":25586347672,\"date_created\":\"2022-09-08T07:40:24.066-04:00\",\"date_approved\":\"2022-09-08T07:40:26.471-04:00\",\"date_last_updated\":\"2022-09-08T07:40:26.471-04:00\",\"date_of_expiration\":null,\"money_release_date\":\"2022-09-08T07:40:26.471-04:00\",\"money_release_status\":null,\"operation_type\":\"regular_payment\",\"issuer_id\":\"1070\",\"payment_method_id\":\"debvisa\",\"payment_type_id\":\"debit_card\",\"status\":\"approved\",\"status_detail\":\"accredited\",\"currency_id\":\"PEN\",\"description\":\"Order # 7000004231 in store https:\\/\\/pe.store.asus.com\\/\",\"live_mode\":true,\"sponsor_id\":222568315,\"authorization_code\":\"769867\",\"money_release_schema\":null,\"taxes_amount\":0,\"counter_currency\":null,\"brand_id\":null,\"shipping_amount\":0,\"build_version\":\"2.110.0-rc-1\",\"pos_id\":null,\"store_id\":null,\"integrator_id\":\"222568315\",\"platform_id\":\"BP1EF6QIC4P001KBGQ10\",\"corporation_id\":null,\"collector_id\":1063181428,\"payer\":{\"type\":null,\"id\":\"1194092796\",\"operator_id\":null,\"email\":\"dpinedoperez18@gmail.com\",\"identification\":{\"type\":\"DNI\",\"number\":\"74815881\"},\"phone\":{\"area_code\":null,\"number\":null,\"extension\":null},\"first_name\":null,\"last_name\":null,\"entity_type\":null},\"marketplace_owner\":null,\"metadata\":{\"site\":null,\"checkout_type\":\"credit_card\",\"platform_version\":\"2.4.2\",\"test_mode\":true,\"module_version\":\"3.8.3\",\"sponsor_id\":\"222568315\",\"checkout\":\"custom\",\"platform\":\"Magento\",\"token\":\"6cbba925da295c1d343945c1a3a7003f\"},\"additional_info\":{\"items\":[{\"id\":\"90NR03U2-M007K0\",\"title\":\"Laptop ASUS TUF Gaming F15\",\"description\":\"Laptop ASUS TUF Gaming F15\",\"picture_url\":\"https:\\/\\/d1zktoovjdma6n.cloudfront.net\\/static\\/version1661306102\\/webapi_rest\\/_view\\/es_PE\\/Magento_Catalog\\/images\\/product\\/placeholder\\/.jpg\",\"category_id\":\"others\",\"quantity\":\"1\",\"unit_price\":\"3099\"}],\"payer\":{\"phone\":{\"area_code\":\"0\",\"number\":\"938269751\"},\"address\":{\"street_name\":\"M j - L 07 A.H 5 de octubre Lomas de Zapallal - LIMA - PE\"},\"first_name\":\"Denilson\",\"last_name\":\"Pinedo P&eacute;rez\",\"registration_date\":\"2022-09-07T19:45:11\"},\"shipments\":{\"receiver_address\":{\"street_name\":\"M j - L 07 A.H 5 de octubre Lomas de Zapallal - LIMA - PE\",\"floor\":\"-\",\"apartment\":\"-\"}},\"available_balance\":null,\"nsu_processadora\":\"368243562451\",\"authentication_code\":null},\"order\":[],\"external_reference\":\"7000004231\",\"transaction_amount\":3099,\"transaction_amount_refunded\":0,\"coupon_amount\":0,\"differential_pricing_id\":null,\"deduction_schema\":null,\"installments\":1,\"transaction_details\":{\"payment_method_reference_id\":\"995222516552062\",\"net_received_amount\":2983.13,\"total_paid_amount\":3099,\"overpaid_amount\":0,\"external_resource_url\":null,\"installment_amount\":3099,\"financial_institution\":null,\"payable_deferral_period\":null,\"acquirer_reference\":null},\"fee_details\":[{\"type\":\"mercadopago_fee\",\"amount\":115.87,\"fee_payer\":\"collector\"}],\"charges_details\":[],\"captured\":true,\"binary_mode\":false,\"call_for_authorize_id\":null,\"statement_descriptor\":\"MPAGO*AMAZEPERUEIRL\",\"card\":{\"id\":null,\"first_six_digits\":\"455788\",\"last_four_digits\":\"5560\",\"bin\":\"45578804\",\"expiration_month\":8,\"expiration_year\":2026,\"date_created\":\"2022-09-08T07:40:24.000-04:00\",\"date_last_updated\":\"2022-09-08T07:40:24.000-04:00\",\"cardholder\":{\"name\":\"Denilson Perez\",\"identification\":{\"number\":\"74815881\",\"type\":\"DNI\"}}},\"notification_url\":\"https:\\/\\/pe.store.asus.com\\/mercadopago\\/notifications\\/custom\\/\",\"refunds\":[],\"processing_mode\":\"aggregator\",\"merchant_account_id\":null,\"merchant_number\":null,\"point_of_interaction\":{\"type\":\"UNSPECIFIED\",\"business_info\":{\"unit\":\"online_payments\",\"sub_unit\":\"magento\"}}}"
}
const value = JSON.parse(ex.value)
const data = {
  mercadopagoid: value.id,
  totalStore: value.transaction_details.total_paid_amount,
  totalReceived: value.transaction_details.net_received_amount
}

console.log(data)