package com.example.proyecto_roomia.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.proyecto_roomia.components.AppBottomBar
import com.example.proyecto_roomia.navigation.Screen
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserProfileChangeRequest
import com.google.firebase.firestore.FirebaseFirestore

@Composable
fun PerfilScreen(navController: NavController) {
    val auth = FirebaseAuth.getInstance()
    val db = FirebaseFirestore.getInstance()
    val user = auth.currentUser

    var nombre by remember { mutableStateOf(user?.displayName ?: "") }
    var telefono by remember { mutableStateOf("") }
    var editando by remember { mutableStateOf(false) }
    var mensaje by remember { mutableStateOf("") }

    // Cargar teléfono de Firestore
    LaunchedEffect(user?.uid) {
        user?.uid?.let { uid ->
            db.collection("usuarios").document(uid).get()
                .addOnSuccessListener { doc ->
                    telefono = doc.getString("telefono") ?: ""
                    if (nombre.isEmpty()) nombre = doc.getString("nombre") ?: ""
                }
        }
    }

    Scaffold(
        bottomBar = { AppBottomBar(navController, Screen.Perfil.route) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(24.dp))
            Surface(
                shape = CircleShape,
                color = Color(0xFF1A8FFF),
                modifier = Modifier.size(100.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.Person, contentDescription = null,
                        tint = Color.White, modifier = Modifier.size(60.dp))
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = if (nombre.isNotEmpty()) nombre else user?.email ?: "Usuario",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold
            )
            Text(text = user?.email ?: "Sin correo", color = Color.Gray)
            Spacer(modifier = Modifier.height(24.dp))

            if (editando) {
                OutlinedTextField(
                    value = nombre,
                    onValueChange = { nombre = it },
                    label = { Text("Nombre") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = telefono,
                    onValueChange = { telefono = it },
                    label = { Text("Teléfono") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        // Guardar nombre en Firebase Auth
                        val profileUpdate = UserProfileChangeRequest.Builder()
                            .setDisplayName(nombre)
                            .build()
                        user?.updateProfile(profileUpdate)

                        // Guardar teléfono en Firestore
                        user?.uid?.let { uid ->
                            db.collection("usuarios").document(uid)
                                .set(mapOf("nombre" to nombre, "telefono" to telefono))
                                .addOnSuccessListener {
                                    mensaje = "Perfil actualizado ✅"
                                    editando = false
                                }
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1A8FFF))
                ) {
                    Text("Guardar cambios")
                }
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = { editando = false },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Cancelar")
                }
            } else {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("📧 ${user?.email ?: "Sin correo"}")
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("📱 ${if (telefono.isNotEmpty()) telefono else "Sin teléfono"}")
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("🔑 UID: ${user?.uid?.take(8)}...")
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { editando = true },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1A8FFF))
                ) {
                    Text("Editar perfil")
                }
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = {
                        auth.signOut()
                        navController.navigate(Screen.Login.route) { popUpTo(0) }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Cerrar sesión", color = Color.Red)
                }
            }

            if (mensaje.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(mensaje, color = Color(0xFF1A8FFF))
            }
        }
    }
}