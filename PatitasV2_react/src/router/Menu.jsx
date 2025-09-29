export var navigation = [
  { name: "Dashboard", icon: "HomeIcon", href: "/dashboard" },
  {
    name: "Mascotas",
    icon: "ReceiptPercentIcon",
    permissions: [],
    children: [
      {
        name: "Mascota",
        href: "mascota/list",
        icon: "MapIcon",
        permissions: ["read_mascota"],
      },
      {
        name: "Historial",
        href: "historial/list",
        icon: "DocumentDuplicateIcon",
        permissions: ["read_historial"],
      },
      {
        name: "Adopcion",
        href: "adopcion/list",
        icon: "FaceSmileIcon",
        permissions: ["read_adopcion"],
      },
      //childrenMascotas
    ],
  },
  {
    name: "Denuncias",
    icon: "FaceFrownIcon",
    permissions: [],
    children: [
      {
        name: "Denuncia",
        href: "denuncia/list",
        icon: "ArrowTrendingDownIcon",
        permissions: ["read_denuncia"],
      },
      //childrenDenuncias
    ],
  },
  //sectionMenu
];
export var adminNavigation = [
  {
    name: "Gestion de Usuarios",
    icon: "UsersIcon",
    permissions: [],
    children: [
      {
        name: "Usuarios",
        href: "user/list",
        icon: "UserIcon",
        permissions: ["read_user"],
      },
      {
        name: "Grupos/Permisos",
        href: "group/list",
        icon: "KeyIcon",
        permissions: ["read_group"],
      },
    ],
  },
];

//Llenar Permisos
navigation.forEach((element) => {
  if (element.children) {
    var permissions = [];
    element.children.forEach((element2) => {
      permissions.push(element2.permissions);
    });
    element.permissions = permissions;
  }
});
adminNavigation.forEach((element) => {
  if (element.children) {
    var permissions = [];
    element.children.forEach((element2) => {
      permissions.push(element2.permissions);
    });
    element.permissions = permissions;
  }
});
