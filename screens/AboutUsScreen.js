import React, {useRef, useCallback} from 'react';
import {Text, ScrollView, StyleSheet, Linking, TouchableOpacity, View, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, fonts, spacing} from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';

const EMAILS = [
  {section: 'Email Frati', items: [
    'missionaridellavia.cassano@gmail.com',
    'missionaridellavia.napoli@gmail.com',
  ]},
  {section: 'Email Suore', items: [
    'missionariedellavia.cassano@gmail.com',
    'missionariedellavia.napoli@gmail.com',
  ]},
];

const SOCIAL = [
  {icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/people/Missionari-e-Missionarie-della-Via/100068706078801/'},
  {icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/missionaridellavia/'},
  {icon: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/channel/UCI-KljGpZAOQlazH5vuRlfA'},
];

const LINKS = [
  {label: 'Missionari della Via', url: 'http://www.missionaridellavia.net/'},
  {label: 'Vocazione', url: 'https://www.vocazione.altervista.org/#/'},
  {label: 'Comunità', url: 'https://www.cristianidistrada.net/'},
  {label: 'Blog', url: 'https://blogdeipiccolidellavia.blogspot.com/'},
];

export default function AboutUsScreen() {
  const scrollRef = useRef(null);
  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({y: 0, animated: false});
  }, []));

  return (
    <ScrollView ref={scrollRef} style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Chi Siamo"
        subtitle="Breve storia della comunità"
      />

      <Card>
        <Text style={styles.heading}>
          I Missionari e Missionarie della Via
        </Text>
        <Image
          source={require('../assets/chi-siamo.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <Text style={styles.bodyText}>
          La storia della comunità è partita dal cuore di Dio e dalla libera risposta di tre giovani provenienti da diverse parti d'Italia, che sentendo di consacrarsi a Dio, si ritrovarono a vivere una missione comune: fra Faustino, fra Umile e suor Chiara. Con l'entusiasmo e la semplicità di voler vivere il Vangelo, si imbattono in una prima esperienza di vita evangelica, sentendo che lo Spirito Santo faceva crescere in loro un forte desiderio di missionarietà contemplativa, un grande amore per la Verità e per una radicale povertà. Dopo essersi confrontati con il Vescovo di Lamezia Terme di quel tempo mons. Luigi A. Cantafora, che seguiva questa loro ispirazione, offrirono un pellegrinaggio per comprendere meglio la loro vocazione, percorrendo a piedi e senza nulla – come i primi discepoli del Signore – vari santuari mariani dell'Europa. Ivi, per grazia di Dio, sentirono forte nel cuore il richiamo missionario a donare la loro vita per testimoniare che Dio si è proclamato Verità, proprio quella verità che il cuore dell'uomo cerca incessantemente: la verità dell'Amore. Iniziarono così, in una Chiesa semi-abbandonata e in un terreno deserto alla periferia di Lamezia Terme, a vivere una vita semplice, avendo come unica regola il Vangelo, mettendosi sotto la protezione della Madonna della Via fiore del Carmelo e di San Giuseppe suo sposo, patroni e protettori della loro vita di missionari poveri e itineranti. Il percorso intrapreso proseguì non solo con la loro consacrazione religiosa e il loro semplice abito religioso color della terra (per ricordare l'umiltà di Dio che spogliò sé stesso prendendo la nostra natura umana) ma ricevettero anche l'approvazione da parte della Chiesa e, inoltre, i due fratelli divennero sacerdoti.
        </Text>

        <Text style={styles.bodyText}>
          Da qui sono nati i frati e le suore della Via che, ispirandosi alla vita della prima comunità cristiana ("quelli della Via" - At 9,2), vivono la grazia della consacrazione religiosa come missionari apostolici, evangelizzatori poveri e itineranti. La Comunità non è mista ma frati e suore condividono dei momenti di preghiera e di missione. Con una vita all'insegna della semplicità, senza circolo di denaro e totalmente dedita alla Provvidenza, i fratelli e le sorelle, uniti dalla preghiera, fonte di ogni azione, seguono il Signore in questo stile di vita: operosi nel lavorare i frutti della terra che il Signore ha donato, dediti ad una formazione seria e fondata, amanti della Verità da testimoniare, andando incontro a tutti, specialmente agli ultimi.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>SITI WEB</Text>
        {LINKS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactRow}
            onPress={() => Linking.openURL(item.url)}
            activeOpacity={0.7}
          >
            <View style={styles.contactIcon}>
              <MaterialCommunityIcons name="web" size={20} color={colors.primary} />
            </View>
            <Text style={styles.contactLabel}>{item.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>CONTATTI</Text>
        {EMAILS.map((group, gi) => (
          <View key={gi}>
            <Text style={styles.groupLabel}>{group.section}</Text>
            {group.items.map((email, ei) => (
              <TouchableOpacity
                key={ei}
                style={styles.contactRow}
                onPress={() => Linking.openURL(`mailto:${email}`)}
                activeOpacity={0.7}
              >
                <View style={styles.contactIcon}>
                  <MaterialCommunityIcons name="email-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.contactLabel} numberOfLines={1}>{email}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>SOCIAL</Text>
        <View style={styles.socialRow}>
          {SOCIAL.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.socialBtn}
              onPress={() => Linking.openURL(item.url)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name={item.icon} size={28} color={colors.white} />
              <Text style={styles.socialLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.textDark,
    lineHeight: 28,
    marginBottom: spacing.md,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  groupLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 18,
    color: colors.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(166,125,81,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  contactLabel: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.textDark,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  socialBtn: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  socialLabel: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.white,
    marginTop: spacing.xs,
  },
});
