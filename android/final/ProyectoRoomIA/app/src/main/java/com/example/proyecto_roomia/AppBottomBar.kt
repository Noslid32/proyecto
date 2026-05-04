package com.example.proyecto_roomia.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavController
import com.example.proyecto_roomia.navigation.Screen

@Composable
fun AppBottomBar(navController: NavController, currentRoute: String) {
    NavigationBar {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
            label = { Text("Inicio") },
            selected = currentRoute == Screen.Home.route,
            onClick = { navController.navigate(Screen.Home.route) },
            colors = NavigationBarItemDefaults.colors(
                indicatorColor = Color(0xFF1A8FFF),
                selectedIconColor = Color.White
            )
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Favorite, contentDescription = "Favoritos") },
            label = { Text("Guardados") },
            selected = currentRoute == Screen.Favorites.route,
            onClick = { navController.navigate(Screen.Favorites.route) },
            colors = NavigationBarItemDefaults.colors(
                indicatorColor = Color(0xFF1A8FFF),
                selectedIconColor = Color.White
            )
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Person, contentDescription = "Perfil") },
            label = { Text("Perfil") },
            selected = currentRoute == Screen.Perfil.route,
            onClick = { navController.navigate(Screen.Perfil.route) },
            colors = NavigationBarItemDefaults.colors(
                indicatorColor = Color(0xFF1A8FFF),
                selectedIconColor = Color.White
            )
        )
    }
}