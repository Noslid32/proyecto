package com.example.proyecto_roomia.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.proyecto_roomia.navigation.Screen
import com.google.firebase.auth.FirebaseAuth
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme

@Composable
fun LoginScreen(navController: NavController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMsg by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    val auth = FirebaseAuth.getInstance()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("RoomIA", fontSize = 36.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A8FFF))
        Spacer(modifier = Modifier.height(8.dp))
        Text("Inicia sesión para continuar", color = Color.Gray)
        Spacer(modifier = Modifier.height(32.dp))
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Correo electrónico") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Contraseña") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )
        if (errorMsg.isNotEmpty()) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(errorMsg, color = Color.Red, fontSize = 14.sp)
        }
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = {
                if (email.isEmpty() || password.isEmpty()) {
                    errorMsg = "Completa todos los campos"
                    return@Button
                }
                isLoading = true
                errorMsg = ""
                auth.signInWithEmailAndPassword(email, password)
                    .addOnSuccessListener {
                        isLoading = false
                        navController.navigate(Screen.Home.route)
                    }
                    .addOnFailureListener {
                        isLoading = false
                        errorMsg = "Correo o contraseña incorrectos"
                    }
            },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1A8FFF)),
            enabled = !isLoading
        ) {
            if (isLoading) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
            else Text("Iniciar sesión", fontSize = 16.sp)
        }
        Spacer(modifier = Modifier.height(16.dp))
        TextButton(onClick = {
            if (email.isEmpty() || password.isEmpty()) {
                errorMsg = "Completa todos los campos"
                return@TextButton
            }
            isLoading = true
            errorMsg = ""
            auth.createUserWithEmailAndPassword(email, password)
                .addOnSuccessListener {
                    isLoading = false
                    navController.navigate(Screen.Home.route)
                }
                .addOnFailureListener {
                    isLoading = false
                    errorMsg = it.message ?: "Error al registrarse"
                }
        }) {
            Text("¿No tienes cuenta? Regístrate", color = MaterialTheme.colorScheme.background)
        }
    }
}