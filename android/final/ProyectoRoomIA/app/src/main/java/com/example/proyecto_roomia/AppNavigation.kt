package com.example.proyecto_roomia.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

import com.example.proyecto_roomia.HomeScreen
import com.example.proyecto_roomia.DetailsScreen
import com.example.proyecto_roomia.FavoritesScreen
import com.example.proyecto_roomia.LoginScreen
import com.example.proyecto_roomia.PerfilScreen

sealed class Screen(val route: String) {
    object Home      : Screen("home")
    object Details   : Screen("details")
    object Favorites : Screen("favorites")
    object Login     : Screen("login")
    object Perfil    : Screen("perfil")
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = Screen.Home.route) {
        composable(Screen.Home.route)      { HomeScreen(navController) }
        composable(Screen.Details.route)   { DetailsScreen(navController) }
        composable(Screen.Favorites.route) { FavoritesScreen(navController) }
        composable(Screen.Login.route)     { LoginScreen(navController) }
        composable(Screen.Perfil.route)    { PerfilScreen(navController) }
    }
}