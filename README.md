
# SISTEMA DE CAJA DE AHORRO - DOCUMENTACIÓN TÉCNICA

## 1. INTRODUCCIÓN
El Sistema de Caja de Ahorro es una aplicación web desarrollada en ASP.NET Core que permite la gestión integral de una caja de ahorro, incluyendo la administración de socios, cuentas de ahorro, créditos y contabilidad.

## 2. ARQUITECTURA
- Backend: ASP.NET Core Web API  
- Base de Datos: SQL Server  
- ORM: Entity Framework Core  
- Autenticación: JWT (pendiente de implementar)  

## 3. ESTRUCTURA DEL PROYECTO
```
/Controllers
UsuarioController.cs
SesionesUsuarioController.cs
HistorialAccionesController.cs
SociosController.cs
AportacionesController.cs
CuentasAhorroController.cs
MovimientosAhorroController.cs
SolicitudesCreditoController.cs
CreditosController.cs
PagosCreditoController.cs
PlanCuentasController.cs
LibroDiarioController.cs
ParametrosGeneralesController.cs
ReportesController.cs
/Models
Entidades principales
Vistas
Contexto de base de datos
/BD
Scripts de tablas
Triggers
Procedimientos almacenados
Vistas
Datos iniciales
```
## 4. ENDPOINTS DE LA API
### 4.1 Gestión de Usuarios
- GET    /api/Usuario  
- GET    /api/Usuario/{id}  
- POST   /api/Usuario  
- PUT    /api/Usuario/{id}  
- DELETE /api/Usuario/{id}  

### 4.2 Gestión de Sesiones
- GET    /api/SesionesUsuario  
- GET    /api/SesionesUsuario/{id}  
- POST   /api/SesionesUsuario  
- PUT    /api/SesionesUsuario/{id}/cerrar  
- DELETE /api/SesionesUsuario/{id}  

### 4.3 Gestión de Socios
- GET    /api/Socios  
- GET    /api/Socios/{id}  
- POST   /api/Socios  
- PUT    /api/Socios/{id}  
- DELETE /api/Socios/{id}  

### 4.4 Gestión de Aportaciones
- GET    /api/Aportaciones  
- GET    /api/Aportaciones/{id}  
- POST   /api/Aportaciones  
- PUT    /api/Aportaciones/{id}  
- DELETE /api/Aportaciones/{id}  

### 4.5 Gestión de Cuentas de Ahorro
- GET    /api/CuentasAhorro  
- GET    /api/CuentasAhorro/{id}  
- GET    /api/CuentasAhorro/resumen/{cedula}/{numeroCuenta}  
- POST   /api/CuentasAhorro  
- PUT    /api/CuentasAhorro/{id}  
- DELETE /api/CuentasAhorro/{id}  

### 4.6 Gestión de Movimientos
- GET    /api/MovimientosAhorro  
- GET    /api/MovimientosAhorro/{id}  
- POST   /api/MovimientosAhorro  
- DELETE /api/MovimientosAhorro/{id}  

### 4.7 Gestión de Créditos
- GET    /api/SolicitudesCredito  
- GET    /api/SolicitudesCredito/{id}  
- POST   /api/SolicitudesCredito  
- PUT    /api/SolicitudesCredito/{id}  
- DELETE /api/SolicitudesCredito/{id}  

- GET    /api/Creditos  
- GET    /api/Creditos/{id}  
- POST   /api/Creditos  
- PUT    /api/Creditos/{id}  
- DELETE /api/Creditos/{id}  

- GET    /api/PagosCredito  
- GET    /api/PagosCredito/{id}  
- POST   /api/PagosCredito  
- PUT    /api/PagosCredito/{id}  
- DELETE /api/PagosCredito/{id}  

### 4.8 Contabilidad
- GET    /api/PlanCuentas  
- GET    /api/PlanCuentas/{id}  
- POST   /api/PlanCuentas  
- PUT    /api/PlanCuentas/{id}  
- DELETE /api/PlanCuentas/{id}  

- GET    /api/LibroDiario  
- GET    /api/LibroDiario/{id}  
- POST   /api/LibroDiario  
- PUT    /api/LibroDiario/{id}  
- DELETE /api/LibroDiario/{id}  

### 4.9 Parámetros Generales
- GET    /api/ParametrosGenerales  
- GET    /api/ParametrosGenerales/{id}  
- GET    /api/ParametrosGenerales/clave/{clave}  
- POST   /api/ParametrosGenerales  
- PUT    /api/ParametrosGenerales/{id}  
- DELETE /api/ParametrosGenerales/{id}  

### 4.10 Reportes
- GET    /api/Reportes/resumen-aportaciones  
- GET    /api/Reportes/resumen-aportaciones/socio/{idSocio}  
- GET    /api/Reportes/historial-ahorros  
- GET    /api/Reportes/historial-ahorros/cuenta/{idCuenta}  
- GET    /api/Reportes/cartera-creditos  
- GET    /api/Reportes/cartera-creditos/socio/{idSocio}  
- GET    /api/Reportes/cartera-creditos/estado/{estado}  

## 5. TRIGGERS Y PROCEDIMIENTOS
### 5.1 Triggers
- tr_actualizar_saldo_ahorro: Actualiza automáticamente el saldo de las cuentas de ahorro  
- tr_registrar_movimiento_contable: Registra los movimientos contables automáticamente  

### 5.2 Procedimientos Almacenados
- sp_GenerarTablaAmortizacion: Genera la tabla de amortización para créditos  

### 5.3 Vistas
- vista_resumen_aportaciones: Resumen de aportaciones por socio  
- vista_historial_ahorros: Historial de movimientos de ahorro  
- vista_cartera_creditos: Cartera de créditos activa  

## 6. VALIDACIONES Y REGLAS DE NEGOCIO
### 6.1 Cuentas de Ahorro
- Saldo mínimo requerido para apertura  
- Límite de retiros por período  
- Cálculo de intereses  

### 6.2 Créditos
- Evaluación de capacidad de pago  
- Límites de crédito por socio  
- Generación de tabla de amortización  
- Cálculo de intereses y comisiones  

### 6.3 Aportaciones
- Tipos de aportación  
- Períodos de aportación  
- Cálculo de rendimientos  

## 7. SEGURIDAD
### 7.1 Autenticación (Pendiente)
- Implementación de JWT  
- Manejo de sesiones  
- Control de acceso por roles  

### 7.2 Auditoría
- Registro de acciones en historial  
- Trazabilidad de operaciones  
- Logs de sistema  
