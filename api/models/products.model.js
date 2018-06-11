const mysql = require('mysql')
const connection = require('./connection')

const adm_conn = mysql.createConnection(connection.admin());

exports.getProducts = (req, res) => {
  adm_conn.query("SELECT nota_de_ingresos_productos.no_de_lote," +
    "nota_de_ingresos_productos.registro_sanitario," +
    "nota_de_ingresos_productos.fecha_de_vencimiento," +
    "nota_de_ingresos_productos.unidades_ingresadas," +
    "nota_de_ingresos_productos.precio_de_ingreso_unitario," +
    "nota_de_ingresos_productos.precio_de_ingreso_total," +
    "nota_de_ingresos_productos.observaciones_ingreso," +
    "nota_de_ingresos_productos.fecha_de_registro," +
    "nota_de_ingresos_productos.fecha_de_revision," +
    "nota_de_ingresos_productos.unidades_optimas," +
    "nota_de_ingresos_productos.unidades_defectuosas," +
    "nota_de_ingresos_productos.cantidad_a_la_venta," +
    "nota_de_ingresos_productos.precio_instituciones," +
    "nota_de_ingresos_productos.precio_distribuidora," +
    "nota_de_ingresos_productos.precio_farmacia," +
    "nota_de_ingresos_productos.revisado_por," +
    "nota_de_ingresos_productos.registrado_por," +
    "lab_productos.producto," +
    "lab_productos.concentrado," +
    "lab_productos.presentacion," +
    "lab_productos.clasificacion_terapeutica," +
    "us_funcionarios.nombres," +
    "us_funcionarios.paterno," +
    "us_funcionarios.materno," +
    "us_usuarios.tipo_de_usuario," +
    "laboratorios.descripcion  FROM  nota_de_ingresos_productos  " +
    "INNER  JOIN  lab_productos  ON  nota_de_ingresos_productos.id_producto_laboratorio = lab_productos.id_producto_laboratorio  " +
    "INNER  JOIN  us_usuarios  ON  nota_de_ingresos_productos.registrado_por = us_usuarios.id_usuario  " +
    "INNER  JOIN  us_funcionarios  ON  us_usuarios.funcionario = us_funcionarios.id_funcionario " +
    " INNER  JOIN  laboratorios  ON  lab_productos.id_laboratorio = laboratorios.id_laboratorio " +
    " WHERE  nota_de_ingresos_productos.estado = 'EN INVENTARIO'  AND  nota_de_ingresos_productos.cantidad_a_la_venta >= 1  ", function (err, results) {
    if (err) throw err
    return res.json(results)
  })
}